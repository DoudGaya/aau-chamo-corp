"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu, PackageSearch, UserCheck, X } from "lucide-react";
import { useState } from "react";
import { navigation } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="utility-bar">
        <div className="shell utility-inner">
          <span>Cargo · Aviation · Travel · International Business</span>
          <div className="utility-links">
            <Link href="/track-cargo">Track cargo</Link>
            <Link href="/portal">Client portal</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/enquire">Enquiry</Link>
          </div>
        </div>
      </div>
      <div className="shell nav-row">
        <Link className="brand" href="/" aria-label="A.A.U Chamo home">
          <Image src="/aauchamo-logo.png" alt="A.A.U Chamo" width={889} height={281} priority />
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </nav>
        <div className="nav-actions">
          <Link className="button red" href="/onboard" style={{ fontWeight: "700" }}>
            Get Started / Onboard <ArrowUpRight size={16} />
          </Link>
          <button
            className="menu-button"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>
      </div>
      {open && (
        <>
          <div className="mobile-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
          <nav id="mobile-navigation" className="mobile-menu" aria-label="Mobile navigation">
            {[
              ...navigation,
              { label: "Track cargo", href: "/track-cargo" },
              { label: "Client Portal", href: "/portal" },
              { label: "Get Started / Onboard", href: "/onboard" },
            ].map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}{item.href === "/track-cargo" ? <PackageSearch size={16} /> : null}
              </Link>
            ))}
          </nav>
        </>
      )}
    </header>
  );
}
