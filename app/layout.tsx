import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@/components/analytics";
import { Assistant } from "@/components/assistant";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "A.A.U Chamo | Cargo, Travel & Business Services",
    template: "%s | A.A.U Chamo",
  },
  description:
    "Cargo logistics, flight reservations, courier delivery, visa support and international business services across Nigeria and beyond.",
  applicationName: "A.A.U Chamo",
  keywords: ["air cargo Nigeria", "cargo logistics Kano", "flight reservation Nigeria", "courier delivery", "Umrah travel", "clearing and forwarding"],
  authors: [{ name: "A.A.U Chamo International Business Agency Services Limited" }],
  creator: "A.A.U Chamo",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: siteConfig.url,
    siteName: "A.A.U Chamo",
    title: "A.A.U Chamo | Cargo, Travel & Business Services",
    description: "One dependable gateway for cargo, travel and international business services.",
    images: [{ url: "/cargo-operations-hero.png", width: 1672, height: 941, alt: "Air cargo operations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "A.A.U Chamo",
    description: "Cargo, travel and international business services.",
    images: ["/cargo-operations-hero.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "A.A.U Chamo International Business Agency Services Limited",
    url: siteConfig.url,
    logo: `${siteConfig.url}/aauchamo-logo.png`,
    email: siteConfig.email,
    areaServed: "Nigeria",
    description: "Cargo logistics, travel and international business services.",
  };

  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <WhatsAppButton />
        <Assistant />
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
