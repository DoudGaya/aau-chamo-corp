"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  Compass,
  FileText,
  Globe,
  Lock,
  Mail,
  Package,
  Phone,
  Plane,
  ShieldCheck,
  Sparkles,
  Truck,
  User,
} from "lucide-react";

const AVAILABLE_SERVICES = [
  {
    id: "air-cargo",
    name: "Air Cargo & Freight Forwarding",
    desc: "Direct consolidation and airport-to-airport freight forwarding across Nigeria and global routes.",
    icon: Package,
    tag: "High Volume / Express",
  },
  {
    id: "flight-tickets",
    name: "Flight Reservations & Ticketing",
    desc: "Domestic and international airline flight bookings, corporate travel desk, and instant re-issuance.",
    icon: Plane,
    tag: "Aviation Desk",
  },
  {
    id: "courier-express",
    name: "Courier & Express Parcel Delivery",
    desc: "Door-to-door, station-to-station express parcels and high-priority business cargo dispatches.",
    icon: Truck,
    tag: "Nationwide",
  },
  {
    id: "customs-clearing",
    name: "Customs Clearing & Inspection Services",
    desc: "Seamless customs documentation, port clearance, tariff assessment, and trade compliance in Nigeria.",
    icon: FileText,
    tag: "Regulatory Support",
  },
  {
    id: "hajj-umrah",
    name: "Hajj & Umrah Pilgrimage Travel",
    desc: "Authorized pilgrimage delegations, visa procurement, premium accommodation, and guided logistics.",
    icon: Compass,
    tag: "Pilgrimage Division",
  },
  {
    id: "agency-trade",
    name: "International Business Agency & Trade",
    desc: "Cross-border procurement representation, cargo escrow, and corporate trade agency services.",
    icon: Globe,
    tag: "Trade Operations",
  },
];

export default function OnboardPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "Air Cargo & Freight Forwarding",
  ]);

  const [accountType, setAccountType] = useState<"INDIVIDUAL" | "CORPORATE" | "AGENT">("CORPORATE");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Kano");
  const [address, setAddress] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const toggleService = (name: string) => {
    if (selectedServices.includes(name)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s !== name));
      }
    } else {
      setSelectedServices([...selectedServices, name]);
    }
  };

  const handleNextStep = () => {
    setError(null);
    if (step === 1) {
      if (selectedServices.length === 0) {
        setError("Please choose at least one service to proceed.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!fullName.trim()) {
        setError("Please provide your full name or company representative name.");
        return;
      }
      if (!email.trim() || !email.includes("@")) {
        setError("Please enter a valid business email address.");
        return;
      }
      if (!phone.trim()) {
        setError("Please provide an active phone or WhatsApp number.");
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          companyName: accountType !== "INDIVIDUAL" ? companyName : undefined,
          email,
          phone,
          accountType,
          selectedServices,
          password,
          city,
          address,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Failed to complete onboarding.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/portal");
      }, 1600);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--paper-bright, #fffdf9)", paddingBottom: "80px" }}>
      {/* Top Banner */}
      <div style={{ background: "var(--ink, #111214)", color: "#fff", padding: "48px 0 36px" }}>
        <div className="shell">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <span className="eyebrow" style={{ color: "var(--red, #c90812)" }}>Customer Onboarding Portal</span>
              <h1 style={{ margin: "12px 0 6px", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: "750", color: "#fff" }}>
                Start Your Journey with A.A.U Chamo
              </h1>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.75)", fontSize: "16px", maxWidth: "600px" }}>
                Configure your service preferences, set up your direct client portal, and connect seamlessly with our operations desk.
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>Already have an account?</span>
              <br />
              <Link
                href="/portal/login"
                style={{
                  display: "inline-block",
                  marginTop: "6px",
                  color: "#fff",
                  textDecoration: "underline",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                Sign In to Client Portal →
              </Link>
            </div>
          </div>

          {/* Stepper Progress */}
          <div style={{ display: "flex", gap: "12px", marginTop: "36px", maxWidth: "700px" }}>
            {[
              { num: 1, title: "Select Services" },
              { num: 2, title: "Company & Contact" },
              { num: 3, title: "Security & Preferences" },
            ].map((s) => {
              const isActive = step === s.num;
              const isPast = step > s.num;
              return (
                <div
                  key={s.num}
                  style={{
                    flex: 1,
                    borderTop: `3px solid ${isActive || isPast ? "var(--red, #c90812)" : "rgba(255,255,255,0.2)"}`,
                    paddingTop: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      color: isActive ? "#fff" : isPast ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
                      fontWeight: isActive ? "700" : "500",
                    }}
                  >
                    Step {s.num}: {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="shell" style={{ marginTop: "40px" }}>
        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #f87171",
              color: "#991b1b",
              borderRadius: "8px",
              padding: "14px 18px",
              marginBottom: "24px",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <ShieldCheck size={18} />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div
            style={{
              background: "#fff",
              border: "1px solid var(--line, #d7d1c8)",
              borderRadius: "12px",
              padding: "60px 24px",
              textAlign: "center",
              boxShadow: "0 12px 36px rgba(0,0,0,0.04)",
              maxWidth: "600px",
              margin: "40px auto",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "#dcfce7",
                color: "#16a34a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <BadgeCheck size={36} />
            </div>
            <h2 style={{ fontSize: "28px", fontWeight: "750", margin: "0 0 12px", color: "var(--ink, #111214)" }}>
              Welcome to A.A.U Chamo!
            </h2>
            <p style={{ fontSize: "16px", color: "var(--ink-soft, #303238)", lineHeight: "1.6", margin: "0 0 24px" }}>
              Your client portal account has been created and synced with our central ERP system. A confirmation email has been dispatched to{" "}
              <strong>{email}</strong>.
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--red, #c90812)", fontWeight: "600" }}>
              <Sparkles size={18} /> Redirecting to your personal dashboard...
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: "860px", margin: "0 auto" }}>
            {/* STEP 1: SERVICE SELECTION */}
            {step === 1 && (
              <div style={{ background: "#fff", border: "1px solid var(--line, #d7d1c8)", borderRadius: "12px", padding: "36px 32px", boxShadow: "0 8px 30px rgba(0,0,0,0.03)" }}>
                <div style={{ marginBottom: "28px" }}>
                  <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--red, #c90812)", fontWeight: "700" }}>
                    Step 1 of 3
                  </span>
                  <h2 style={{ margin: "6px 0 8px", fontSize: "24px", fontWeight: "750", color: "var(--ink, #111214)" }}>
                    Which services are you interested in?
                  </h2>
                  <p style={{ margin: 0, color: "var(--muted, #6f706f)", fontSize: "15px" }}>
                    Select all services relevant to your business or travel needs. You can request quotations and book any of these directly.
                  </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
                  {AVAILABLE_SERVICES.map((srv) => {
                    const isSelected = selectedServices.includes(srv.name);
                    const Icon = srv.icon;
                    return (
                      <div
                        key={srv.id}
                        onClick={() => toggleService(srv.name)}
                        style={{
                          border: isSelected ? "2px solid var(--red, #c90812)" : "1px solid var(--line, #d7d1c8)",
                          background: isSelected ? "rgba(201, 8, 18, 0.03)" : "#fff",
                          borderRadius: "10px",
                          padding: "20px",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                          position: "relative",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                            <div
                              style={{
                                width: "42px",
                                height: "42px",
                                borderRadius: "8px",
                                background: isSelected ? "var(--red, #c90812)" : "var(--paper, #f4f1eb)",
                                color: isSelected ? "#fff" : "var(--ink, #111214)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Icon size={22} />
                            </div>
                            <div
                              style={{
                                width: "22px",
                                height: "22px",
                                borderRadius: "50%",
                                border: isSelected ? "none" : "2px solid var(--line, #d7d1c8)",
                                background: isSelected ? "var(--red, #c90812)" : "transparent",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                              }}
                            >
                              {isSelected && <Check size={14} />}
                            </div>
                          </div>
                          <h4 style={{ margin: "0 0 6px", fontSize: "16px", fontWeight: "700", color: "var(--ink, #111214)" }}>
                            {srv.name}
                          </h4>
                          <p style={{ margin: 0, fontSize: "13px", color: "var(--ink-soft, #303238)", lineHeight: "1.5" }}>
                            {srv.desc}
                          </p>
                        </div>
                        <div style={{ marginTop: "14px" }}>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: "600",
                              background: isSelected ? "rgba(201, 8, 18, 0.1)" : "var(--paper, #f4f1eb)",
                              color: isSelected ? "var(--red, #c90812)" : "var(--muted, #6f706f)",
                              padding: "2px 8px",
                              borderRadius: "4px",
                            }}
                          >
                            {srv.tag}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "32px", borderTop: "1px solid var(--line, #d7d1c8)", paddingTop: "24px" }}>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="button red"
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 28px", fontSize: "15px" }}
                  >
                    Continue to Details <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: COMPANY & CONTACT INFORMATION */}
            {step === 2 && (
              <div style={{ background: "#fff", border: "1px solid var(--line, #d7d1c8)", borderRadius: "12px", padding: "36px 32px", boxShadow: "0 8px 30px rgba(0,0,0,0.03)" }}>
                <div style={{ marginBottom: "28px" }}>
                  <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--red, #c90812)", fontWeight: "700" }}>
                    Step 2 of 3
                  </span>
                  <h2 style={{ margin: "6px 0 8px", fontSize: "24px", fontWeight: "750", color: "var(--ink, #111214)" }}>
                    Your Contact & Business Information
                  </h2>
                  <p style={{ margin: 0, color: "var(--muted, #6f706f)", fontSize: "15px" }}>
                    This information will be associated with your account on the AAU Chamo ERP for instant identification and service routing.
                  </p>
                </div>

                {/* Account Type Selector */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--ink, #111214)", marginBottom: "8px" }}>
                    Account Type
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                    {[
                      { id: "CORPORATE", label: "Corporate Business", icon: Building2 },
                      { id: "AGENT", label: "Cargo / Travel Agent", icon: Globe },
                      { id: "INDIVIDUAL", label: "Individual / Personal", icon: User },
                    ].map((type) => {
                      const isSel = accountType === type.id;
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setAccountType(type.id as any)}
                          style={{
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: isSel ? "2px solid var(--red, #c90812)" : "1px solid var(--line, #d7d1c8)",
                            background: isSel ? "rgba(201, 8, 18, 0.04)" : "#fff",
                            color: isSel ? "var(--red, #c90812)" : "var(--ink, #111214)",
                            fontWeight: isSel ? "700" : "500",
                            fontSize: "14px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                          }}
                        >
                          <Icon size={16} /> {type.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--ink, #111214)", marginBottom: "6px" }}>
                      Full Name / Contact Person *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Alhaji Aminu Bello"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid var(--line, #d7d1c8)", fontSize: "14px" }}
                    />
                  </div>

                  {accountType !== "INDIVIDUAL" && (
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--ink, #111214)", marginBottom: "6px" }}>
                        Company / Agency Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Kano Northern Logistics Ltd"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid var(--line, #d7d1c8)", fontSize: "14px" }}
                      />
                    </div>
                  )}

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--ink, #111214)", marginBottom: "6px" }}>
                      Email Address (Login ID) *
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. logistics@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid var(--line, #d7d1c8)", fontSize: "14px" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--ink, #111214)", marginBottom: "6px" }}>
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +234 803 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid var(--line, #d7d1c8)", fontSize: "14px" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--ink, #111214)", marginBottom: "6px" }}>
                      City / State
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kano, Abuja, Lagos"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid var(--line, #d7d1c8)", fontSize: "14px" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--ink, #111214)", marginBottom: "6px" }}>
                      Physical / Office Address
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Airport Road, Kano"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid var(--line, #d7d1c8)", fontSize: "14px" }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px", borderTop: "1px solid var(--line, #d7d1c8)", paddingTop: "24px" }}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="button light"
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 24px" }}
                  >
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="button red"
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 28px" }}
                  >
                    Continue to Security <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: SECURITY & PORTAL ACCESS */}
            {step === 3 && (
              <form onSubmit={handleSubmit} style={{ background: "#fff", border: "1px solid var(--line, #d7d1c8)", borderRadius: "12px", padding: "36px 32px", boxShadow: "0 8px 30px rgba(0,0,0,0.03)" }}>
                <div style={{ marginBottom: "28px" }}>
                  <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--red, #c90812)", fontWeight: "700" }}>
                    Step 3 of 3
                  </span>
                  <h2 style={{ margin: "6px 0 8px", fontSize: "24px", fontWeight: "750", color: "var(--ink, #111214)" }}>
                    Set Up Your Secure Password
                  </h2>
                  <p style={{ margin: 0, color: "var(--muted, #6f706f)", fontSize: "15px" }}>
                    Create a secure password to access your AAU Chamo client portal, track shipments, and review invoices.
                  </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "24px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--ink, #111214)", marginBottom: "6px" }}>
                      Portal Password (min 6 characters) *
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid var(--line, #d7d1c8)", fontSize: "14px" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--ink, #111214)", marginBottom: "6px" }}>
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid var(--line, #d7d1c8)", fontSize: "14px" }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--ink, #111214)", marginBottom: "6px" }}>
                    Initial Cargo or Travel Requirement / Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about any upcoming shipments, routes, or dates so our team can prepare your rates immediately..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid var(--line, #d7d1c8)", fontSize: "14px" }}
                  />
                </div>

                <div style={{ background: "var(--paper, #f4f1eb)", padding: "16px 20px", borderRadius: "8px", marginBottom: "28px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <ShieldCheck size={20} style={{ color: "var(--red, #c90812)", flexShrink: 0, marginTop: "2px" }} />
                    <div style={{ fontSize: "13px", color: "var(--ink-soft, #303238)", lineHeight: "1.5" }}>
                      <strong>Automatic Central ERP Sync:</strong> By submitting, your record is stored on the AAU Chamo ERP system, providing your assigned operations officer immediate visibility to assist with bookings, cargo manifests, and customs processing.
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--line, #d7d1c8)", paddingTop: "24px" }}>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={loading}
                    className="button light"
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 24px" }}
                  >
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="button red"
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 32px", fontSize: "15px", fontWeight: "700" }}
                  >
                    {loading ? "Completing Onboarding..." : "Complete Onboarding & Enter Portal"} <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
