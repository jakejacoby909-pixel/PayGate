import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import PageTransition from "@/components/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://pay-gate.dev"),
  title: {
    default: "PayGate — Checkout Page Builder | Create Payment Pages in Seconds",
    template: "%s | PayGate",
  },
  description:
    "Create beautiful, hosted checkout pages powered by Stripe in seconds. No code required. 8 templates, analytics, countdown timers, coupons, and more. Free to start.",
  keywords: [
    "checkout page builder",
    "payment page builder",
    "stripe checkout page",
    "hosted checkout",
    "payment links",
    "create checkout page",
    "sell online",
    "no code checkout",
    "stripe payment page",
    "online payment page",
    "checkout page creator",
    "payment link generator",
  ],
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "PayGate — Create Checkout Pages in Seconds",
    description:
      "Build beautiful, hosted checkout pages powered by Stripe. 8 templates, built-in analytics, urgency tools, and more. No code required. Free to start.",
    url: "https://pay-gate.dev",
    siteName: "PayGate",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PayGate — Create Checkout Pages in Seconds",
    description:
      "Build beautiful checkout pages powered by Stripe in under 60 seconds. No code, no complexity. Free to start.",
  },
  verification: {
    google: "f5NnJfq6ZT5YcIpHmsZDFAEwKEvFJmA9U_y_ol6dWQo",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <PageTransition>
            {children}
          </PageTransition>
        </AuthProvider>
      </body>
    </html>
  );
}
