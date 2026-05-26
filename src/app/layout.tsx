import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { ConsentBanner } from "@/components/ConsentBanner";
import { Analytics } from "@vercel/analytics/react";
import { AutoLogout } from "@/components/AutoLogout";
import "./globals.css";

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
  metadataBase: new URL("https://ainexusconsulting.co.za"),
  title: "AI Nexus Consulting | Websites, Apps & Human-Loop AI Consulting",
  description:
    "South Africa-based websites, custom apps, lead capture systems, and human-reviewed AI consulting for businesses that need a credible online presence and less admin drag.",
  keywords: ["website design South Africa", "app development South Africa", "AI consulting", "South Africa", "POPIA", "lead capture", "workflow automation"],
  openGraph: {
    title: "AI Nexus Consulting",
    description: "Websites, apps, lead systems, and human-loop AI consulting for South African businesses",
    url: "https://ainexusconsulting.co.za",
    siteName: "AI Nexus Consulting",
    type: "website",
  },
  alternates: {
    canonical: "/",
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
        {children}
        <ConsentBanner />
        <Analytics />
      </body>
    </html>
  );
}
