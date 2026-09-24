export const siteConfig = {
  name: "A.A.U Chamo",
  legalName: "A.A.U Chamo International Business Agency Services Limited",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@aauchamo.com",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "Official line available on request",
  address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS || "Kano, Nigeria",
  hours: process.env.NEXT_PUBLIC_BUSINESS_HOURS || "Monday - Saturday, 08:00 - 18:00 WAT",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
  mapEmbedUrl: process.env.NEXT_PUBLIC_MAP_EMBED_URL || "",
  socialLinks: [
    process.env.NEXT_PUBLIC_FACEBOOK_URL,
    process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    process.env.NEXT_PUBLIC_LINKEDIN_URL,
    process.env.NEXT_PUBLIC_X_URL,
  ].filter((value): value is string => Boolean(value)),
};

export function whatsappHref(message = "Hello A.A.U Chamo, I would like to make an enquiry.") {
  if (!siteConfig.whatsappNumber) return "/contact?channel=whatsapp";
  const number = siteConfig.whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export const navigation = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Cargo", href: "/cargo-logistics" },
  { label: "Flight & Travel", href: "/flight-travel" },
  { label: "Umrah", href: "/umrah-ziyarah" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
];
