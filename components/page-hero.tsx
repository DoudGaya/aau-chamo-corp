import Link from "next/link";
import { ChevronRight } from "lucide-react";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  meta?: string[];
};

export function PageHero({ eyebrow, title, description, meta = [] }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="shell">
        <div className="breadcrumbs"><Link href="/">Home</Link><ChevronRight size={13} /><span>{title}</span></div>
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="display">{title}</h1>
        <p className="lede">{description}</p>
        {meta.length ? <div className="page-hero-meta">{meta.map((item) => <span key={item}>{item}</span>)}</div> : null}
      </div>
    </section>
  );
}
