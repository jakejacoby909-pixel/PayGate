"use client";
import Link from "next/link";

export default function PrivacyPage() {
  const lastUpdated = "February 10, 2026";

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--background)",
      padding: "0 24px 80px",
    }}>
      {/* Header */}
      <header style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: "32px 0 24px",
        borderBottom: "1px solid var(--border)",
        marginBottom: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "var(--foreground)" }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: "linear-gradient(135deg, var(--primary), var(--secondary))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4v16" /><path d="M20 4v16" /><path d="M4 4c0 0 3-2 8-2s8 2 8 2" />
              <path d="M12 10v8" /><path d="M14.5 10.5c0 0-0.8-0.5-2.5-0.5s-2.5 1-2.5 2 1 1.8 2.5 2.2 2.5 1.2 2.5 2.3-1 2-2.5 2-2.5-0.5-2.5-0.5" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: "1rem" }}>PayGate</span>
        </Link>
        <Link href="/" style={{ fontSize: "0.85rem", color: "var(--muted)", textDecoration: "none" }}>
          Back to Home
        </Link>
      </header>

      {/* Content */}
      <div style={{ maxWidth: 800, margin: "0 auto", lineHeight: 1.8 }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 8, letterSpacing: "-0.03em" }}>Privacy Policy</h1>
        <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginBottom: 40 }}>Last updated: {lastUpdated}</p>

        <Section title="1. Introduction">
          <p>PayGate (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.</p>
        </Section>

        <Section title="2. Information We Collect">
          <p><strong>Account Information:</strong> When you create an account, we collect your email address and authentication credentials. If you sign in with Google, we receive your name, email address, and profile picture from Google.</p>
          <p><strong>Page Data:</strong> We store the checkout page configurations you create, including product names, descriptions, prices, images, and customization settings.</p>
          <p><strong>Usage Data:</strong> We collect page view counts, conversion metrics, and general usage analytics to operate and improve the Service.</p>
          <p><strong>Transaction Data:</strong> When payments are processed through your checkout pages, we receive transaction metadata from Stripe including amounts, dates, and customer email addresses. We do not collect or store payment card numbers, CVVs, or other sensitive payment card data — this information is handled exclusively by Stripe.</p>
          <p><strong>Device and Log Data:</strong> We may automatically collect information such as your IP address, browser type, operating system, and referring URLs when you access the Service.</p>
        </Section>

        <Section title="3. How We Use Your Information">
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, operate, and maintain the Service</li>
            <li>Process and track transactions through your checkout pages</li>
            <li>Calculate and collect platform fees</li>
            <li>Authenticate your identity and manage your account</li>
            <li>Provide customer support</li>
            <li>Send service-related communications (account verification, security alerts, updates)</li>
            <li>Analyze usage patterns to improve the Service</li>
            <li>Detect, prevent, and address fraud and security issues</li>
            <li>Comply with legal obligations</li>
          </ul>
        </Section>

        <Section title="4. Information Sharing">
          <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
          <ul>
            <li><strong>Service Providers:</strong> We use third-party services (Stripe for payments, Supabase for data storage, Google for authentication, Vercel for hosting) that may process your data to operate the Service. These providers are bound by their own privacy policies.</li>
            <li><strong>Legal Requirements:</strong> We may disclose your information if required by law, regulation, legal process, or governmental request.</li>
            <li><strong>Protection of Rights:</strong> We may disclose information to protect our rights, property, safety, or the rights of others, including to enforce our Terms of Service.</li>
            <li><strong>Business Transfer:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
          </ul>
        </Section>

        <Section title="5. Data Security">
          <p>We implement reasonable technical and organizational security measures to protect your data, including:</p>
          <ul>
            <li>Encryption of data in transit (HTTPS/TLS)</li>
            <li>Secure authentication via Supabase and Google OAuth</li>
            <li>Row-level security policies on our database</li>
            <li>No storage of sensitive payment card data on our servers</li>
          </ul>
          <p>However, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security of your data.</p>
        </Section>

        <Section title="6. Data Retention">
          <p>We retain your account data and page configurations for as long as your account is active. Transaction records are retained for a minimum period necessary to comply with legal and financial reporting obligations.</p>
          <p>If you delete your account, we will delete or anonymize your personal data within 30 days, except where retention is required by law.</p>
        </Section>

        <Section title="7. Your Rights">
          <p>Depending on your jurisdiction, you may have the following rights:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
            <li><strong>Deletion:</strong> Request deletion of your personal data</li>
            <li><strong>Portability:</strong> Request your data in a machine-readable format</li>
            <li><strong>Objection:</strong> Object to certain processing of your data</li>
            <li><strong>Withdraw Consent:</strong> Withdraw consent where processing is based on consent</li>
          </ul>
          <p>To exercise any of these rights, contact us at support@paygate.app.</p>
        </Section>

        <Section title="8. Cookies and Local Storage">
          <p>We use browser cookies and local storage to:</p>
          <ul>
            <li>Maintain your authentication session</li>
            <li>Store page draft data locally in your browser</li>
            <li>Remember your preferences</li>
          </ul>
          <p>We do not use cookies for advertising or cross-site tracking.</p>
        </Section>

        <Section title="9. Third-Party Services">
          <p>Our Service integrates with the following third-party services, each governed by their own privacy policies:</p>
          <ul>
            <li><strong>Stripe:</strong> Payment processing — <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)" }}>Stripe Privacy Policy</a></li>
            <li><strong>Google:</strong> OAuth authentication — <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)" }}>Google Privacy Policy</a></li>
            <li><strong>Supabase:</strong> Data storage and authentication — <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)" }}>Supabase Privacy Policy</a></li>
            <li><strong>Vercel:</strong> Hosting — <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)" }}>Vercel Privacy Policy</a></li>
          </ul>
        </Section>

        <Section title="10. Children's Privacy">
          <p>The Service is not intended for individuals under 18 years of age. We do not knowingly collect personal data from children. If we learn that we have collected data from a child under 18, we will delete it promptly.</p>
        </Section>

        <Section title="11. International Data Transfers">
          <p>Your data may be transferred to and processed in countries other than your country of residence, including the United States. These countries may have different data protection laws. By using the Service, you consent to such transfers.</p>
        </Section>

        <Section title="12. Changes to This Policy">
          <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the updated policy on this page with a revised &quot;Last updated&quot; date. Your continued use of the Service after changes constitutes acceptance of the updated policy.</p>
        </Section>

        <Section title="13. Contact">
          <p>If you have questions or concerns about this Privacy Policy, contact us at:</p>
          <p><strong>Email:</strong> support@paygate.app</p>
        </Section>

        {/* Footer */}
        <div style={{ marginTop: 60, paddingTop: 32, borderTop: "1px solid var(--border)", display: "flex", gap: 24, fontSize: "0.85rem" }}>
          <Link href="/" style={{ color: "var(--muted)", textDecoration: "none" }}>Home</Link>
          <Link href="/terms" style={{ color: "var(--muted)", textDecoration: "none" }}>Terms of Service</Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: 12, letterSpacing: "-0.01em" }}>{title}</h2>
      <div style={{ color: "var(--foreground)", fontSize: "0.92rem", opacity: 0.85 }}>
        {children}
      </div>
      <style jsx>{`
        div :global(p) { margin: 0 0 12px; }
        div :global(ul) { margin: 0 0 12px; padding-left: 24px; }
        div :global(li) { margin-bottom: 6px; }
      `}</style>
    </section>
  );
}
