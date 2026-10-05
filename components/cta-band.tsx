import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

export function CtaBand({ title = "Ready to move your cargo or travel forward?" }: { title?: string }) {
  return (
    <section className="cta-band section">
      <div className="shell cta-inner">
        <div>
          <h2>{title}</h2>
          <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.8)", fontSize: "16px" }}>
            Select your services and complete seamless digital onboarding in under 2 minutes.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <Link className="button light" href="/onboard" style={{ fontWeight: "700" }}>
            Get Started & Onboard <ArrowUpRight size={18} />
          </Link>
          <Link
            href="/portal"
            style={{
              color: "#fff",
              padding: "10px 16px",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Client Portal
          </Link>
        </div>
      </div>
    </section>
  );
}
