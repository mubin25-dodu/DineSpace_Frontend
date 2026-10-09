import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import JsonLd from "@/components/JsonLd"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dinespace.mu-bin.dev"),
  title: {
    default:
      "DineSpace — Contactless Restaurant Ordering & Table-Side Dining Platform",
    template: "%s | DineSpace",
  },
  description:
    "Order food directly from your table without waiting for a waiter. DineSpace connects diners with restaurants through QR code menus, real-time order tracking, and contactless dining. Browse menus, place orders, and enjoy a better restaurant experience.",
  keywords: [
    "contactless dining",
    "QR code restaurant ordering",
    "order food from table",
    "restaurant ordering system",
    "digital restaurant menu",
    "scan to order restaurant",
    "restaurant management platform",
    "online food ordering",
    "table-side ordering",
    "DineSpace",
    "kitchen display system",
    "real-time order tracking",
  ],
  authors: [{ name: "Abdullah Al Mubin", url: "https://mu-bin.dev" }],
  creator: "Abdullah Al Mubin",
  publisher: "DineSpace",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dinespace.mu-bin.dev",
    siteName: "DineSpace",
    title: "DineSpace — Contactless Restaurant Ordering Platform",
    description:
      "Order food directly from your table. QR code menus, real-time order tracking, and seamless restaurant operations — all in one platform.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DineSpace — Contactless Dining Platform with QR Code Menu Ordering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DineSpace — Contactless Restaurant Ordering Platform",
    description:
      "Order food directly from your table without waiting for a waiter. QR code menus & real-time order tracking.",
    images: ["/og-image.jpg"],
  },
  manifest: "/manifest.json",
  category: "Food & Dining",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
