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
    default: "DineSpace | Restaurant ordering from the table",
    template: "%s | DineSpace",
  },
  description:
    "DineSpace connects restaurant digital menus and diner table orders with the team managing each meal. Browse restaurants, place an order, and follow its progress.",
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
    title: "DineSpace | Restaurant ordering from the table",
    description:
      "Connect restaurant digital menus and diner table orders with the team managing each meal.",
    images: [
      {
        url: "/Diner/table-qr-scan.jpg",
        width: 2000,
        height: 1000,
        alt: "A diner scanning a restaurant table QR code stand",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DineSpace | Restaurant ordering from the table",
    description:
      "Connect restaurant digital menus and diner table orders with the team managing each meal.",
    images: ["/Diner/table-qr-scan.jpg"],
  },
  manifest: "/manifest.json",
  category: "Food & Dining",
  verification: {
    google: "google6033545ec43517b3",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <JsonLd />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
      
    </html>
  );
}
