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
  publisher: "A.A.U Chamo International Business Agency Services Limited",
  category: "Logistics and travel services",
  alternates: { canonical: "/" },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
  },
  formatDetection: { email: false, address: false, telephone: false },
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
  icons: { icon: "/favicon.ico", apple: "/aauchamo-logo.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.legalName,
        alternateName: siteConfig.name,
        url: siteConfig.url,
        logo: { "@type": "ImageObject", url: `${siteConfig.url}/aauchamo-logo.png` },
        email: siteConfig.email,
        telephone: siteConfig.phone,
        address: { "@type": "PostalAddress", streetAddress: siteConfig.address, addressCountry: "NG" },
        areaServed: { "@type": "Country", name: "Nigeria" },
        sameAs: siteConfig.socialLinks,
        description: "Cargo logistics, travel and international business services.",
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        publisher: { "@id": `${siteConfig.url}/#organization` },
        inLanguage: "en-NG",
      },
    ],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
