#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

// Load .env from this directory
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    process.env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
}

const LEADS_PATH = path.join(__dirname, "leads.json");
const SENT_PATH = path.join(__dirname, "sent.json");
const DELAY_MS = 30_000; // 30 seconds between sends
const DRY_RUN = process.argv.includes("--dry-run");

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const FROM_NAME = process.env.FROM_NAME || "Jake";

if (!DRY_RUN && (!GMAIL_USER || !GMAIL_APP_PASSWORD)) {
  console.error(
    "Missing GMAIL_USER or GMAIL_APP_PASSWORD in scripts/outreach/.env"
  );
  console.error("Run with --dry-run to preview emails without credentials.");
  process.exit(1);
}

// --- Helpers ---

function loadJSON(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function saveJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function formatRevenue(revenue) {
  if (typeof revenue === "number") {
    return revenue >= 1000
      ? `$${(revenue / 1000).toFixed(revenue % 1000 === 0 ? 0 : 1)}k`
      : `$${revenue}`;
  }
  return revenue; // already a string like "$5k"
}

function calcSavings(revenue) {
  // Gumroad takes 10% flat fee
  // PayGate: 2.9% + $0.30 per txn (Stripe) — we estimate ~3.5% effective
  // Savings = ~6.5% of revenue
  const rev = typeof revenue === "number" ? revenue : parseFloat(revenue.replace(/[$k,]/g, "")) * (revenue.includes("k") ? 1000 : 1);
  const gumroadFees = rev * 0.1;
  const paygateFees = rev * 0.035;
  const saved = gumroadFees - paygateFees;
  return {
    gumroadFees: Math.round(gumroadFees),
    paygateFees: Math.round(paygateFees),
    saved: Math.round(saved),
  };
}

// --- Email template ---

function generateEmail(lead) {
  const rev = formatRevenue(lead.revenue);
  const { gumroadFees, saved } = calcSavings(lead.revenue);
  const firstName = lead.name.split(" ")[0];

  const subject = `${firstName}, you're leaving ~$${saved.toLocaleString()}/yr on the table`;

  const body = `Hey ${firstName},

I came across ${lead.product} on Gumroad — ${lead.painPoint ? lead.painPoint : "looks like a great product"}.

Quick math on your fees: at ${rev}/yr in revenue, Gumroad's 10% cut means you're paying ~$${gumroadFees.toLocaleString()}/yr in platform fees alone.

I built PayGate — it lets you sell digital products through your own Stripe account. You keep the standard processing rate (~3.5%) instead of 10%. That's ~$${saved.toLocaleString()}/yr back in your pocket.

Setup takes about 5 minutes: connect Stripe, add your products, and drop a payment link on your site. No monthly fees, no lock-in.

Would you be open to a quick look? Happy to set up a demo or just answer questions.

Best,
${FROM_NAME}`;

  return { subject, body };
}

// --- Main ---

async function main() {
  const leads = loadJSON(LEADS_PATH, []);
  const sent = loadJSON(SENT_PATH, []);
  const sentEmails = new Set(sent.map((s) => s.email.toLowerCase()));

  const toSend = leads.filter((l) => !sentEmails.has(l.email.toLowerCase()));

  if (toSend.length === 0) {
    console.log("No new leads to email. Add more to leads.json.");
    return;
  }

  console.log(
    `${DRY_RUN ? "[DRY RUN] " : ""}Found ${toSend.length} unsent lead(s) out of ${leads.length} total.\n`
  );

  let transporter;
  if (!DRY_RUN) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    });

    // Verify connection
    try {
      await transporter.verify();
      console.log("Gmail SMTP connection verified.\n");
    } catch (err) {
      console.error("Failed to connect to Gmail SMTP:", err.message);
      console.error(
        "Check your GMAIL_USER and GMAIL_APP_PASSWORD in .env"
      );
      process.exit(1);
    }
  }

  for (let i = 0; i < toSend.length; i++) {
    const lead = toSend[i];
    const { subject, body } = generateEmail(lead);

    console.log(`--- [${i + 1}/${toSend.length}] ${lead.name} <${lead.email}> ---`);
    console.log(`Subject: ${subject}`);
    console.log(`\n${body}\n`);

    if (DRY_RUN) {
      console.log("[DRY RUN] Skipping send.\n");
      continue;
    }

    try {
      await transporter.sendMail({
        from: `${FROM_NAME} <${GMAIL_USER}>`,
        to: lead.email,
        subject,
        text: body,
      });

      sent.push({
        email: lead.email,
        name: lead.name,
        sentAt: new Date().toISOString(),
      });
      saveJSON(SENT_PATH, sent);

      console.log("Sent successfully.\n");
    } catch (err) {
      console.error(`Failed to send to ${lead.email}:`, err.message);
      console.error("Stopping to avoid further errors.\n");
      break;
    }

    // Rate limit — wait between sends (skip on last email)
    if (i < toSend.length - 1) {
      console.log(`Waiting ${DELAY_MS / 1000}s before next send...`);
      await sleep(DELAY_MS);
    }
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
