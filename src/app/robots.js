export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/builder/", "/dashboard/", "/auth/"],
      },
    ],
    sitemap: "https://pay-gate.dev/sitemap.xml",
  };
}
