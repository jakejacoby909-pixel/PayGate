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
  title: "PayGate — Instant Checkout Pages",
  description: "Create beautiful, hosted checkout pages powered by Stripe in seconds. No code required.",
  keywords: ["checkout", "payment", "stripe", "hosted checkout", "payment links", "checkout page builder"],
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "PayGate — Instant Checkout Pages",
    description: "Create beautiful, hosted checkout pages powered by Stripe in seconds. No code required.",
    url: "https://pay-gate.dev",
    siteName: "PayGate",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PayGate — Instant Checkout Pages",
    description: "Create beautiful, hosted checkout pages powered by Stripe in seconds. No code required.",
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
