import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function CtaBand({ title = "Ready to move your request forward?" }: { title?: string }) {
  return (
    <section className="cta-band section">
      <div className="shell cta-inner">
        <h2>{title}</h2>
        <Link className="button light" href="/enquire">Start an enquiry <ArrowUpRight size={18} /></Link>
      </div>
    </section>
  );
}
