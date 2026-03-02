import Link from "next/link";

export const metadata = {
  title: "Blog — PayGate",
  description: "Tips, comparisons, and guides for selling digital products online with lower fees and higher conversions.",
  openGraph: {
    title: "Blog — PayGate",
    description: "Tips, comparisons, and guides for selling digital products online.",
    url: "https://pay-gate.dev/blog",
  },
};

const POSTS = [
  {
    slug: "gumroad-alternative",
    title: "PayGate vs Gumroad: Why Creators Are Switching in 2026",
    description: "A detailed comparison of fees, features, and flexibility. See how much you could save by switching from Gumroad to PayGate.",
    date: "March 1, 2026",
    tag: "Comparison",
    readTime: "5 min read",
  },
];

export default function BlogPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      {/* Nav */}
      <nav style={{
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: 1100,
        margin: "0 auto",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "var(--foreground)" }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: "linear-gradient(135deg, var(--primary), var(--secondary))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
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

      {/* Header */}
      <section style={{ textAlign: "center", padding: "60px 24px 48px", maxWidth: 700, margin: "0 auto" }}>
        <h1 style={{
          fontSize: "clamp(2rem, 5vw, 3rem)",
          fontWeight: 800,
          letterSpacing: "-0.04em",
          lineHeight: 1.1,
          margin: "0 0 16px",
        }}>
          Blog
        </h1>
        <p style={{ fontSize: "1.05rem", color: "var(--muted)", lineHeight: 1.7, maxWidth: 500, margin: "0 auto" }}>
          Guides, comparisons, and tips to help you sell more online.
        </p>
      </section>

      {/* Posts */}
      <section style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{
                display: "block",
                padding: 28,
                borderRadius: 16,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                textDecoration: "none",
                color: "var(--foreground)",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: "var(--primary)",
                  background: "rgba(22,163,74,0.08)",
                  padding: "3px 10px",
                  borderRadius: 6,
                  border: "1px solid rgba(22,163,74,0.15)",
                }}>
                  {post.tag}
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{post.date}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{post.readTime}</span>
              </div>
              <h2 style={{
                fontSize: "1.3rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                margin: "0 0 8px",
                lineHeight: 1.3,
              }}>
                {post.title}
              </h2>
              <p style={{
                fontSize: "0.9rem",
                color: "var(--muted)",
                margin: 0,
                lineHeight: 1.6,
              }}>
                {post.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "32px 24px", textAlign: "center" }}>
        <p style={{ fontSize: "0.82rem", color: "var(--muted)", margin: 0 }}>
          &copy; {new Date().getFullYear()} Jacoby Digital LLC. Powered by Stripe.
        </p>
      </footer>
    </div>
  );
}
