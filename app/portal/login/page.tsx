"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";

export default function PortalLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Failed to sign in");
      }

      router.push("/portal");
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "85vh", background: "var(--paper-bright, #fffdf9)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "#fff",
          border: "1px solid var(--line, #d7d1c8)",
          borderRadius: "14px",
          padding: "40px 32px",
          boxShadow: "0 16px 48px rgba(17, 18, 20, 0.06)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <span className="eyebrow" style={{ color: "var(--red, #c90812)" }}>Client Portal</span>
          <h1 style={{ margin: "10px 0 8px", fontSize: "26px", fontWeight: "750", color: "var(--ink, #111214)" }}>
            Welcome Back
          </h1>
          <p style={{ margin: 0, color: "var(--muted, #6f706f)", fontSize: "14px" }}>
            Sign in to manage your cargo consignments, travel reservations, and active service requests.
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #f87171",
              color: "#991b1b",
              borderRadius: "8px",
              padding: "12px 16px",
              marginBottom: "20px",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <ShieldCheck size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--ink, #111214)", marginBottom: "6px" }}>
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={16} style={{ position: "absolute", left: "14px", top: "14px", color: "var(--muted, #6f706f)" }} />
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 40px",
                  borderRadius: "8px",
                  border: "1px solid var(--line, #d7d1c8)",
                  fontSize: "14px",
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--ink, #111214)", marginBottom: "6px" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={16} style={{ position: "absolute", left: "14px", top: "14px", color: "var(--muted, #6f706f)" }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 40px",
                  borderRadius: "8px",
                  border: "1px solid var(--line, #d7d1c8)",
                  fontSize: "14px",
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="button red"
            style={{
              width: "100%",
              marginTop: "8px",
              padding: "14px",
              fontSize: "15px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {loading ? "Signing in..." : "Sign In to Portal"} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ marginTop: "28px", paddingTop: "20px", borderTop: "1px solid var(--line, #d7d1c8)", textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: "14px", color: "var(--muted, #6f706f)" }}>
            New to A.A.U Chamo?{" "}
            <Link href="/onboard" style={{ color: "var(--red, #c90812)", fontWeight: "700", textDecoration: "underline" }}>
              Onboard now →
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
