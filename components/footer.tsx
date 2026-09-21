import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <Image src="/aauchamo-logo.png" alt="A.A.U Chamo" width={889} height={281} />
          <p>A dependable customer gateway for cargo logistics, travel support and international business services.</p>
        </div>
        <div className="footer-column">
          <h3>Company</h3>
          <Link href="/about">About us</Link>
          <Link href="/news">News & updates</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div className="footer-column">
          <h3>Services</h3>
          {services.slice(0, 5).map((service) => <Link key={service.slug} href={`/services/${service.slug}`}>{service.shortTitle}</Link>)}
        </div>
        <div className="footer-column">
          <h3>Customer desk</h3>
          <Link href="/enquire">Book / enquire</Link>
          <Link href="/track-cargo">Track cargo</Link>
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          <span>{siteConfig.hours}</span>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} {siteConfig.legalName}</span>
        <span>Enquiries are requests until authorised confirmation</span>
      </div>
    </footer>
  );
}
