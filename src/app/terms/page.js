"use client";
import Link from "next/link";

export default function TermsPage() {
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
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 8, letterSpacing: "-0.03em" }}>Terms of Service</h1>
        <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginBottom: 40 }}>Last updated: {lastUpdated}</p>

        <Section title="1. Acceptance of Terms">
          <p>By accessing or using PayGate (&quot;the Service&quot;), operated by PayGate (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree, you may not use the Service.</p>
          <p>We reserve the right to update these Terms at any time. Continued use of the Service after changes constitutes acceptance of the revised Terms.</p>
        </Section>

        <Section title="2. Description of Service">
          <p>PayGate is a software-as-a-service platform that enables users to create, customize, and publish hosted checkout pages for selling digital and physical products. Payments are processed by Stripe, a third-party payment processor. PayGate does not directly process, store, or handle payment card information.</p>
        </Section>

        <Section title="3. Eligibility">
          <p>You must be at least 18 years old and capable of entering into a legally binding agreement to use this Service. By using PayGate, you represent and warrant that you meet these requirements.</p>
        </Section>

        <Section title="4. Account Registration">
          <p>To access certain features, you must create an account. You agree to provide accurate, current, and complete information and to keep your account credentials secure. You are solely responsible for all activity that occurs under your account.</p>
          <p>We reserve the right to suspend or terminate accounts that violate these Terms or are used for fraudulent activity.</p>
        </Section>

        <Section title="5. Platform Fees">
          <p>PayGate charges a transaction fee of 5% on each successful payment processed through checkout pages created on the platform. This fee is in addition to any fees charged by Stripe or other third-party payment processors.</p>
          <p>We reserve the right to modify our fee structure with 30 days&apos; prior notice. Fee changes will not apply retroactively to transactions already completed.</p>
        </Section>

        <Section title="6. User Responsibilities">
          <p>As a user of PayGate, you agree to:</p>
          <ul>
            <li>Only sell products and services that you have the legal right to sell</li>
            <li>Comply with all applicable local, state, national, and international laws and regulations</li>
            <li>Not use the Service for any illegal, fraudulent, or deceptive purposes</li>
            <li>Not sell prohibited goods or services including but not limited to: illegal substances, weapons, counterfeit goods, stolen property, or content that violates intellectual property rights</li>
            <li>Accurately represent your products and services to buyers</li>
            <li>Fulfill all orders and obligations to your customers in a timely manner</li>
            <li>Handle customer disputes, refunds, and chargebacks in accordance with applicable law and Stripe&apos;s policies</li>
            <li>Not attempt to circumvent, disable, or interfere with any security features of the Service</li>
          </ul>
        </Section>

        <Section title="7. Prohibited Content and Activities">
          <p>You may not use PayGate to:</p>
          <ul>
            <li>Sell counterfeit, pirated, or stolen goods</li>
            <li>Facilitate money laundering, terrorism financing, or other financial crimes</li>
            <li>Distribute malware, phishing schemes, or other harmful content</li>
            <li>Engage in pyramid schemes, multi-level marketing fraud, or deceptive business practices</li>
            <li>Violate any third party&apos;s intellectual property, privacy, or other rights</li>
            <li>Send spam or unsolicited communications through the platform</li>
            <li>Resell or redistribute the Service without our written consent</li>
            <li>Use automated bots, scrapers, or similar tools to access the Service</li>
          </ul>
          <p>We reserve the right to remove any content or suspend any account that violates these prohibitions, at our sole discretion and without prior notice.</p>
        </Section>

        <Section title="8. Intellectual Property">
          <p><strong>Our IP:</strong> The Service, including its design, code, features, and branding, is owned by PayGate and protected by intellectual property laws. You may not copy, modify, distribute, or reverse-engineer any part of the Service.</p>
          <p><strong>Your Content:</strong> You retain ownership of all content you create or upload to PayGate (product descriptions, images, logos, etc.). By using the Service, you grant us a limited, non-exclusive license to host, display, and transmit your content solely for the purpose of operating the Service.</p>
        </Section>

        <Section title="9. Payment Processing">
          <p>All payments are processed by Stripe. By using PayGate, you agree to Stripe&apos;s <a href="https://stripe.com/legal" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)" }}>Terms of Service</a> and <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)" }}>Privacy Policy</a>.</p>
          <p>PayGate is not responsible for payment processing errors, declined transactions, chargebacks, or disputes between sellers and buyers. You are solely responsible for managing refunds, disputes, and customer communications related to your transactions.</p>
          <p>Stripe may hold, delay, or reverse funds in accordance with their policies. PayGate has no control over Stripe&apos;s fund-holding decisions.</p>
        </Section>

        <Section title="10. Refunds and Chargebacks">
          <p>You are solely responsible for your refund policy and for communicating it to your customers on your checkout pages. PayGate does not issue refunds on behalf of sellers.</p>
          <p>In the event of chargebacks or disputes, you are responsible for providing evidence to Stripe and resolving the dispute. Excessive chargebacks may result in account suspension or termination.</p>
        </Section>

        <Section title="11. Limitation of Liability">
          <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, PAYGATE AND ITS OWNERS, OFFICERS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, REVENUE, DATA, OR BUSINESS OPPORTUNITIES, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE.</p>
          <p>OUR TOTAL LIABILITY FOR ANY CLAIM ARISING FROM OR RELATED TO THE SERVICE SHALL NOT EXCEED THE AMOUNT OF FEES YOU PAID TO PAYGATE IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.</p>
          <p>THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
        </Section>

        <Section title="12. Indemnification">
          <p>You agree to indemnify, defend, and hold harmless PayGate and its owners, officers, employees, and agents from and against any and all claims, liabilities, damages, losses, costs, and expenses (including reasonable attorneys&apos; fees) arising out of or relating to:</p>
          <ul>
            <li>Your use of the Service</li>
            <li>Your violation of these Terms</li>
            <li>Your products or services sold through the platform</li>
            <li>Any dispute between you and your customers</li>
            <li>Your violation of any law or the rights of any third party</li>
          </ul>
        </Section>

        <Section title="13. Disclaimer of Warranties">
          <p>PayGate does not guarantee that the Service will be uninterrupted, error-free, or secure. We do not warrant the accuracy or completeness of any information on the platform. You use the Service at your own risk.</p>
          <p>We are not responsible for any loss or damage resulting from system downtime, data loss, security breaches, or third-party service failures (including Stripe).</p>
        </Section>

        <Section title="14. Termination">
          <p>We may suspend or terminate your account at any time, with or without cause, and with or without notice. Grounds for termination include but are not limited to: violation of these Terms, fraudulent activity, excessive chargebacks, or legal requirements.</p>
          <p>Upon termination, your right to use the Service ceases immediately. We are not liable for any loss of data or revenue resulting from termination. Any fees owed prior to termination remain payable.</p>
          <p>You may terminate your account at any time by contacting us. Termination does not relieve you of any obligations incurred prior to termination.</p>
        </Section>

        <Section title="15. Data and Privacy">
          <p>Your use of the Service is also governed by our <Link href="/privacy" style={{ color: "var(--primary)" }}>Privacy Policy</Link>, which describes how we collect, use, and protect your data.</p>
        </Section>

        <Section title="16. Third-Party Services">
          <p>PayGate integrates with third-party services including Stripe and Google OAuth. We are not responsible for the availability, accuracy, or practices of these third-party services. Your use of third-party services is subject to their respective terms and policies.</p>
        </Section>

        <Section title="17. Dispute Resolution">
          <p>Any dispute arising from or relating to these Terms or the Service shall first be attempted to be resolved through good-faith negotiation. If a dispute cannot be resolved through negotiation within 30 days, it shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.</p>
          <p>You agree to resolve disputes on an individual basis and waive any right to participate in a class action or class-wide arbitration.</p>
        </Section>

        <Section title="18. Governing Law">
          <p>These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law provisions.</p>
        </Section>

        <Section title="19. Severability">
          <p>If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.</p>
        </Section>

        <Section title="20. Entire Agreement">
          <p>These Terms, together with the Privacy Policy, constitute the entire agreement between you and PayGate regarding the Service and supersede all prior agreements and understandings.</p>
        </Section>

        <Section title="21. Contact">
          <p>If you have questions about these Terms, contact us at:</p>
          <p><strong>Email:</strong> support@paygate.app</p>
        </Section>

        {/* Footer */}
        <div style={{ marginTop: 60, paddingTop: 32, borderTop: "1px solid var(--border)", display: "flex", gap: 24, fontSize: "0.85rem" }}>
          <Link href="/" style={{ color: "var(--muted)", textDecoration: "none" }}>Home</Link>
          <Link href="/privacy" style={{ color: "var(--muted)", textDecoration: "none" }}>Privacy Policy</Link>
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
