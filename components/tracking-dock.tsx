"use client";

import { ArrowRight, PackageSearch } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function TrackingDock() {
  const [reference, setReference] = useState("");
  const router = useRouter();

  function submit(event: FormEvent) {
    event.preventDefault();
    const value = reference.trim();
    if (value) router.push(`/track-cargo?reference=${encodeURIComponent(value)}`);
  }

  return (
    <div className="tracking-dock">
      <div className="shell tracking-dock-inner">
        <div className="tracking-label"><strong>Track a shipment</strong><span>Enter your tracking or enquiry reference</span></div>
        <form className="track-form" onSubmit={submit}>
          <label className="sr-only" htmlFor="hero-tracking">Tracking number</label>
          <input id="hero-tracking" value={reference} onChange={(event) => setReference(event.target.value)} placeholder="e.g. AAU-20260921-AB12CD" maxLength={40} />
          <button type="submit" aria-label="Track"><ArrowRight size={19} /></button>
        </form>
        <Link className="status-link" href="/track-cargo"><PackageSearch size={18} /> Tracking help</Link>
      </div>
    </div>
  );
}
