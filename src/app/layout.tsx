import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { ConsentBanner } from "@/components/ConsentBanner";
import { Analytics } from "@vercel/analytics/react";
import { AutoLogout } from "@/components/AutoLogout";
import "./globals.css";

const siteUrl = "https://www.ainexusconsulting.co.za";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "AI Nexus Consulting | Websites, Apps & Human-Loop AI Consulting",
  description:
    "South Africa-based websites, custom apps, lead capture systems, and human-reviewed AI consulting for businesses that need a credible online presence and less admin drag.",
  keywords: [
    "AI consulting South Africa",
    "AI company South Africa",
    "website design South Africa",
    "app development South Africa",
    "workflow automation South Africa",
    "Johannesburg AI consulting",
    "POPIA-aware AI",
    "lead capture systems",
  ],
  openGraph: {
    title: "AI Nexus Consulting",
    description: "Websites, apps, lead systems, and human-loop AI consulting for South African businesses",
    url: siteUrl,
    siteName: "AI Nexus Consulting",
    type: "website",
    locale: "en_ZA",
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      {
        url: "/ai-nexus-mark.svg",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/ai-nexus-mark.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": ["ProfessionalService", "LocalBusiness"],
  "@id": `${siteUrl}/#business`,
  name: "AI Nexus Consulting",
  url: siteUrl,
  description:
    "AI Nexus Consulting builds business websites, custom web apps, lead capture systems, and human-loop AI workflows for South African service businesses.",
  email: "sales@ainexusconsulting.co.za",
  priceRange: "From R3500",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Johannesburg",
    addressCountry: "ZA",
  },
  areaServed: [
    { "@type": "Country", name: "South Africa" },
    { "@type": "City", name: "Johannesburg" },
  ],
  knowsAbout: [
    "AI consulting",
    "website design",
    "custom web app development",
    "lead capture systems",
    "workflow automation",
    "POPIA-aware data workflows",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "AI Nexus Consulting services",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Business website",
        priceCurrency: "ZAR",
        price: "3500",
        url: `${siteUrl}/#pricing`,
      },
      {
        "@type": "Offer",
        name: "Website and lead capture system",
        priceCurrency: "ZAR",
        price: "8500",
        url: `${siteUrl}/#pricing`,
      },
      {
        "@type": "Offer",
        name: "Custom app or workflow pilot",
        priceCurrency: "ZAR",
        price: "18000",
        url: `${siteUrl}/#pricing`,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} antialiased bg-[#fffdf8] text-[#10131a]`}
      >
        <AutoLogout />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
        <ConsentBanner />
        <Analytics />
      </body>
    </html>
  );
}
