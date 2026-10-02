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
    default: "A.A.U Chamo | Cargo Logistics, Travel & Agency Services Nigeria",
    template: "%s | A.A.U Chamo",
  },
  description:
    "A.A.U Chamo International Business Agency Services: Leading provider of air & sea cargo logistics, international freight forwarding, airline flight bookings, Umrah & Ziyarah pilgrimage packages, express courier, and corporate business agency services in Kano, Nigeria.",
  applicationName: "A.A.U Chamo",
  keywords: [
    "A.A.U Chamo",
    "AAU Chamo",
    "A.A.U Chamo International Business Agency Services Limited",
    "cargo logistics Nigeria",
    "air cargo Kano Nigeria",
    "freight forwarding Kano",
    "Mallam Aminu Kano International Airport cargo",
    "courier delivery service Nigeria",
    "flight reservations Kano",
    "cheap flight tickets Nigeria",
    "airline booking agency Kano",
    "Umrah packages Kano Nigeria",
    "Ziyarah pilgrimage travel Nigeria",
    "clearing and forwarding agents Nigeria",
    "visa assistance Nigeria",
    "international trade logistics Kano",
    "door to door cargo shipping",
    "China to Nigeria cargo",
    "Dubai to Nigeria shipping",
    "Turkey to Nigeria air cargo",
  ],
  authors: [{ name: "A.A.U Chamo International Business Agency Services Limited" }],
  creator: "A.A.U Chamo",
  publisher: "A.A.U Chamo International Business Agency Services Limited",
  category: "Logistics, Aviation and Travel Agency Services",
  alternates: {
    canonical: "/",
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || "google83b7063dbda8754b",
  },
  formatDetection: { email: false, address: false, telephone: false },
  other: {
    "geo.region": "NG-KN",
    "geo.placename": "Kano, Nigeria",
    "geo.position": "11.986736;8.587206",
    "ICBM": "11.986736, 8.587206",
    "revisit-after": "3 days",
    "rating": "General",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: siteConfig.url,
    siteName: "A.A.U Chamo",
    title: "A.A.U Chamo | Cargo Logistics, Flight Reservations & Agency Services",
    description:
      "Your dependable African gateway for air cargo logistics, global freight forwarding, flight ticketing, Umrah pilgrimage travel and international business solutions.",
    images: [
      {
        url: "/cargo-operations-hero.png",
        width: 1672,
        height: 941,
        alt: "A.A.U Chamo Air cargo operations and logistics hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "A.A.U Chamo | Cargo, Travel & Business Services",
    description:
      "Dependable air cargo logistics, flight ticketing, Umrah packages and corporate business services across Nigeria.",
    images: ["/cargo-operations-hero.png"],
  },
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
  icons: {
    icon: "/favicon.ico",
    apple: "/aauchamo-logo.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness", "LogisticsService"],
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.legalName,
        alternateName: [siteConfig.name, "AAU Chamo", "A.A.U. Chamo Agency"],
        url: siteConfig.url,
        logo: {
          "@type": "ImageObject",
          "@id": `${siteConfig.url}/#logo`,
          url: `${siteConfig.url}/aauchamo-logo.png`,
          caption: "A.A.U Chamo Logo",
        },
        image: `${siteConfig.url}/cargo-operations-hero.png`,
        email: siteConfig.email,
        telephone: siteConfig.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: siteConfig.address,
          addressLocality: "Kano",
          addressRegion: "Kano State",
          addressCountry: "NG",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 11.986736,
          longitude: 8.587206,
        },
        hasMap: siteConfig.mapEmbedUrl || "https://maps.google.com/?cid=0x11ae83d9f9e7b893",
        priceRange: "$$",
        currenciesAccepted: "NGN, USD",
        paymentAccepted: "Cash, Bank Transfer, POS, Online Payment",
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            opens: "08:00",
            closes: "18:00",
          },
        ],
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: siteConfig.phone,
            contactType: "customer service",
            areaServed: "NG",
            availableLanguage: ["English", "Hausa"],
          },
          {
            "@type": "ContactPoint",
            telephone: siteConfig.phone,
            contactType: "cargo operations",
            areaServed: "NG",
            availableLanguage: ["English", "Hausa"],
          },
          {
            "@type": "ContactPoint",
            telephone: siteConfig.phone,
            contactType: "travel desk",
            areaServed: "NG",
            availableLanguage: ["English", "Hausa"],
          },
        ],
        areaServed: [
          { "@type": "Country", name: "Nigeria" },
          { "@type": "City", name: "Kano" },
          { "@type": "City", name: "Abuja" },
          { "@type": "City", name: "Lagos" },
        ],
        sameAs: siteConfig.socialLinks,
        description:
          "Professional cargo logistics, air freight forwarding, flight ticketing, Umrah pilgrimage packages, courier delivery and international business agency services based in Kano, Nigeria.",
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        publisher: { "@id": `${siteConfig.url}/#organization` },
        inLanguage: "en-NG",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteConfig.url}/track-cargo?reference={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
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
