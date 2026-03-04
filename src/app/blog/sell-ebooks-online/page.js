import Link from "next/link";

export const metadata = {
  title: "How to Sell Ebooks Online Without Gumroad (2026 Guide)",
  description: "Step-by-step guide to selling your ebook online with lower fees. Compare Gumroad, Payhip, and PayGate costs, then set up your checkout page in minutes.",
  keywords: [
    "sell ebooks online",
    "sell ebooks without gumroad",
    "how to sell ebook online",
    "ebook checkout page",
    "sell pdf online",
    "sell digital downloads",
    "gumroad alternative ebooks",
    "ebook payment page",
    "sell ebook with stripe",
  ],
  openGraph: {
    title: "How to Sell Ebooks Online Without Gumroad (2026 Guide)",
    description: "Stop paying 10% on every ebook sale. Here's how to set up your own checkout page with lower fees.",
    url: "https://pay-gate.dev/blog/sell-ebooks-online",
  },
};

const PRICING = [
  { platform: "Gumroad", fee: "10% + $0.50", monthlyCost: "$0", costPer100: "$240", note: "Highest total cost" },
  { platform: "Payhip (free)", fee: "5%", monthlyCost: "$0", costPer100: "$95", note: "" },
  { platform: "PayGate (free)", fee: "5%", monthlyCost: "$0", costPer100: "$95", note: "" },
  { platform: "PayGate Pro", fee: "2%", monthlyCost: "$12", costPer100: "$50", note: "Lowest total cost" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Sell Ebooks Online Without Gumroad (2026 Guide)",
  description: "Step-by-step guide to selling ebooks with lower fees than Gumroad.",
  datePublished: "2026-03-03",
  dateModified: "2026-03-03",
  author: { "@type": "Organization", name: "PayGate", url: "https://pay-gate.dev" },
  publisher: { "@type": "Organization", name: "Jacoby Digital LLC" },
  mainEntityOfPage: "https://pay-gate.dev/blog/sell-ebooks-online",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What's the cheapest way to sell an ebook online?", acceptedAnswer: { "@type": "Answer", text: "PayGate Pro at $12/month with a 2% fee is the cheapest option for most ebook sellers. On a $19 ebook selling 100 copies/month, you'd pay $50 total vs $240 on Gumroad." }},
    { "@type": "Question", name: "How do I deliver my ebook after payment?", acceptedAnswer: { "@type": "Answer", text: "Set your checkout page's success URL to redirect customers to a download page or Google Drive link. You can also email the file manually or use an automation tool like Zapier." }},
    { "@type": "Question", name: "Can I sell an ebook without a website?", acceptedAnswer: { "@type": "Answer", text: "Yes. PayGate gives you a hosted checkout page with its own URL. You don't need a website — just share the link on social media, in emails, or anywhere else." }},
  ],
};

export default function SellEbooksPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <nav style={{ padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1100, margin: "0 auto" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "var(--foreground)" }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg, var(--primary), var(--secondary))", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4v16" /><path d="M20 4v16" /><path d="M4 4c0 0 3-2 8-2s8 2 8 2" />
              <path d="M12 10v8" /><path d="M14.5 10.5c0 0-0.8-0.5-2.5-0.5s-2.5 1-2.5 2 1 1.8 2.5 2.2 2.5 1.2 2.5 2.3-1 2-2.5 2-2.5-0.5-2.5-0.5" />
            </svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>PayGate</span>
        </Link>
        <Link href="/builder" className="btn-primary ripple-btn" style={{ padding: "8px 20px", fontSize: "0.85rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
          Get Started Free
        </Link>
      </nav>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.8rem", color: "var(--muted)" }}>
          <Link href="/blog" style={{ color: "var(--muted)", textDecoration: "none" }}>Blog</Link>
          <span>/</span>
          <span style={{ color: "var(--foreground)" }}>Sell Ebooks Online</span>
        </div>
      </div>

      <article style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#d97706", background: "#d9770614", padding: "3px 10px", borderRadius: 6, border: "1px solid #d9770626" }}>Guide</span>
          <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>March 3, 2026</span>
          <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>6 min read</span>
        </div>

        <h1 style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.15, margin: "0 0 20px" }}>
          How to Sell Ebooks Online Without Gumroad (2026 Guide)
        </h1>
        <p style={{ fontSize: "1.1rem", color: "var(--muted)", lineHeight: 1.7, margin: "0 0 48px" }}>
          Gumroad made it easy to sell digital products, but their 10% + $0.50 fee is hard to justify in 2026. Here&apos;s how to sell your ebook with lower fees and more control.
        </p>

        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px" }}>Why creators are leaving Gumroad</h2>
        <p style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.8, margin: "0 0 12px" }}>
          Gumroad charges <strong style={{ color: "var(--foreground)" }}>10% of every sale plus $0.50 per transaction</strong>. On a $19 ebook, that&apos;s $2.40 gone before Stripe even takes their cut. Sell 100 copies a month and you&apos;re handing Gumroad $240.
        </p>
        <p style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.8, margin: "0 0 12px" }}>
          Beyond fees, Gumroad operates as a Merchant of Record — meaning <em>they</em> own the customer relationship, not you. They also offer limited checkout customization: one fixed design, no countdown timers, no order bumps, no conversion tools.
        </p>
        <p style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.8, margin: "0 0 40px" }}>
          In 2026, there are better options.
        </p>

        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px" }}>What you actually need to sell an ebook</h2>
        <p style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.8, margin: "0 0 12px" }}>
          Selling an ebook online is simpler than you think. You need three things:
        </p>
        <ol style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.8, margin: "0 0 12px", paddingLeft: 20 }}>
          <li><strong style={{ color: "var(--foreground)" }}>Your ebook file</strong> — a PDF, EPUB, or any downloadable format</li>
          <li><strong style={{ color: "var(--foreground)" }}>A payment processor</strong> — Stripe handles credit cards, Apple Pay, Google Pay</li>
          <li><strong style={{ color: "var(--foreground)" }}>A checkout page</strong> — where customers see your product and pay</li>
        </ol>
        <p style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.8, margin: "0 0 40px" }}>
          That&apos;s it. You don&apos;t need a full website, a store, or a complex tech stack.
        </p>

        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px" }}>Step-by-step: Sell your ebook with PayGate</h2>
        <p style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.8, margin: "0 0 16px" }}>
          Here&apos;s how to go from zero to a live checkout page in about 60 seconds:
        </p>
        {[
          { step: "1", title: "Sign up", desc: "Create a free account at pay-gate.dev. No credit card required." },
          { step: "2", title: "Add your ebook details", desc: "Enter your ebook title, price, and description. Upload a cover image or mockup." },
          { step: "3", title: "Choose a template", desc: "Pick from 8 professionally designed templates — Minimal, Bold, Neon, Sunset, Glass, Gradient, Brutalist, or Custom." },
          { step: "4", title: "Add conversion features", desc: "Toggle on countdown timers for launch urgency, coupon codes for promos, social proof counters, and a money-back guarantee badge." },
          { step: "5", title: "Connect Stripe", desc: "Link your Stripe account so payments go directly to you. If you don't have Stripe, setup takes 5 minutes." },
          { step: "6", title: "Share your link", desc: "Get a unique checkout URL. Share it on social media, in emails, on your blog, or via QR code." },
        ].map((s) => (
          <div key={s.step} style={{ display: "flex", gap: 16, marginBottom: 20, padding: 16, borderRadius: 12, background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(22,163,74,0.1)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.85rem", flexShrink: 0 }}>{s.step}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          </div>
        ))}

        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", margin: "20px 0 16px" }}>What about delivery?</h2>
        <p style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.8, margin: "0 0 12px" }}>
          PayGate handles the payment — for delivery, you have a few options:
        </p>
        <ul style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.8, margin: "0 0 12px", paddingLeft: 20 }}>
          <li><strong style={{ color: "var(--foreground)" }}>Success page redirect</strong> — set your checkout&apos;s success URL to a Google Drive download link or a page on your website with the file</li>
          <li><strong style={{ color: "var(--foreground)" }}>Email delivery</strong> — Stripe sends a receipt email. You can manually follow up with the download link, or automate with Zapier</li>
          <li><strong style={{ color: "var(--foreground)" }}>Hosted file services</strong> — use Gumroad just for hosting/delivery if you like, or a service like SendOwl</li>
        </ul>
        <p style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.8, margin: "0 0 40px" }}>
          The simplest approach: host your PDF on Google Drive and redirect customers there after payment.
        </p>

        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px" }}>Pricing comparison: selling a $19 ebook (100 sales/month)</h2>
        <div style={{ overflowX: "auto", margin: "0 0 40px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border)" }}>
                {["Platform", "Fee per sale", "Monthly cost", "Total cost (100 sales)"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "12px 14px", fontWeight: 700, color: "var(--foreground)", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PRICING.map((p, i) => (
                <tr key={p.platform} style={{ borderBottom: "1px solid var(--border)", background: i === 3 ? "rgba(22,163,74,0.04)" : "transparent" }}>
                  <td style={{ padding: "12px 14px", fontWeight: i === 3 ? 700 : 500, color: i === 3 ? "var(--primary)" : "var(--foreground)" }}>{p.platform}</td>
                  <td style={{ padding: "12px 14px", color: "var(--muted)" }}>{p.fee}</td>
                  <td style={{ padding: "12px 14px", color: "var(--muted)" }}>{p.monthlyCost}</td>
                  <td style={{ padding: "12px 14px", color: "var(--muted)", fontWeight: p.note ? 600 : 400 }}>{p.costPer100} {p.note && <span style={{ fontSize: "0.75rem", color: i === 3 ? "var(--primary)" : "#ef4444" }}>({p.note})</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 8, fontStyle: "italic" }}>
            * Stripe&apos;s standard 2.9% + $0.30 processing fee applies on all platforms and is not included above.
          </p>
        </div>

        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 20px" }}>Frequently asked questions</h2>
        {[
          { q: "What's the cheapest way to sell an ebook online?", a: "PayGate Pro at $12/month with a 2% fee gives you the lowest total cost for most ebook sellers. On 100 sales of a $19 ebook, you'd pay $50 total vs $240 on Gumroad." },
          { q: "How do I deliver my ebook after payment?", a: "Redirect customers to a download page after payment. Host your PDF on Google Drive, Dropbox, or your own site and set it as the success URL in PayGate." },
          { q: "Can I sell an ebook without a website?", a: "Yes. PayGate gives you a hosted checkout page with its own URL. Share it on social media, in emails, or anywhere — no website needed." },
        ].map((faq) => (
          <div key={faq.q} style={{ padding: 20, borderRadius: 12, background: "var(--surface)", border: "1px solid var(--border)", marginBottom: 12 }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 8px" }}>{faq.q}</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--muted)", margin: 0, lineHeight: 1.7 }}>{faq.a}</p>
          </div>
        ))}

        <div style={{ marginTop: 48, padding: "40px 32px", borderRadius: 20, background: "linear-gradient(135deg, rgba(22,163,74,0.08), rgba(6,95,70,0.08))", border: "1px solid rgba(22,163,74,0.15)", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0 0 8px" }}>Ready to sell your ebook?</h2>
          <p style={{ color: "var(--muted)", margin: "0 0 20px", fontSize: "0.95rem" }}>Create your checkout page in under 60 seconds. Free to start, no credit card required.</p>
          <Link href="/builder" className="btn-primary ripple-btn" style={{ padding: "12px 28px", fontSize: "0.95rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
            Start Selling
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </Link>
        </div>
      </article>

      <footer style={{ borderTop: "1px solid var(--border)", padding: "32px 24px", textAlign: "center" }}>
        <Link href="/blog" style={{ fontSize: "0.85rem", color: "var(--muted)", textDecoration: "none" }}>&larr; Back to Blog</Link>
        <p style={{ fontSize: "0.82rem", color: "var(--muted)", margin: "16px 0 0" }}>&copy; {new Date().getFullYear()} Jacoby Digital LLC. Powered by Stripe.</p>
      </footer>
    </div>
  );
}
