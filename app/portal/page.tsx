"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Globe,
  LogOut,
  Mail,
  MessageSquare,
  Package,
  Phone,
  Plane,
  Plus,
  RefreshCw,
  Send,
  ShieldCheck,
  Truck,
  User,
  X,
} from "lucide-react";

interface PortalUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  companyName: string | null;
  accountType: string;
  selectedServices: string[];
  city: string | null;
  address: string | null;
  status: string;
  createdAt: string;
}

interface ServiceRequest {
  id: string;
  reference: string;
  type: string;
  message: string;
  status: string;
  department: string;
  createdAt: string;
}

export default function PortalDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<PortalUser | null>(null);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // New Request Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [reqType, setReqType] = useState("Air Cargo & Freight Forwarding");
  const [reqMessage, setReqMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const fetchPortalData = async () => {
    try {
      const authRes = await fetch("/api/auth/portal");
      const authData = await authRes.json();

      if (!authRes.ok || !authData.ok || !authData.user) {
        router.push("/portal/login");
        return;
      }

      setUser(authData.user);

      const reqRes = await fetch("/api/portal/requests");
      const reqData = await reqRes.json();
      if (reqData.ok && reqData.requests) {
        setRequests(reqData.requests);
      }
    } catch (err) {
      console.error("Dashboard load error:", err);
      router.push("/portal/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortalData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/portal", { method: "DELETE" });
      router.push("/portal/login");
    } catch {
      router.push("/portal/login");
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/portal/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: reqType,
          message: reqMessage,
          department: reqType.toLowerCase().includes("flight") ? "Aviation" : "Cargo Operations",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Failed to submit request");
      }

      setSubmitSuccess(`Request submitted successfully! Reference: ${data.request.reference}`);
      setReqMessage("");
      // Refresh requests list
      const updatedReqs = await fetch("/api/portal/requests").then((r) => r.json());
      if (updatedReqs.ok) setRequests(updatedReqs.requests);

      setTimeout(() => {
        setModalOpen(false);
        setSubmitSuccess(null);
      }, 2000);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "var(--ink-soft, #303238)" }}>
          <RefreshCw className="spin" size={32} style={{ color: "var(--red, #c90812)", margin: "0 auto 16px" }} />
          <p style={{ fontWeight: "600" }}>Loading your AAU Chamo client portal...</p>
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main style={{ minHeight: "100vh", background: "var(--paper-bright, #fffdf9)", paddingBottom: "80px" }}>
      {/* Top Portal Banner */}
      <div style={{ background: "var(--ink, #111214)", color: "#fff", padding: "40px 0 32px" }}>
        <div className="shell">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <span className="eyebrow" style={{ color: "var(--red, #c90812)", margin: 0 }}>
                  Client Portal
                </span>
                <span
                  style={{
                    background: "rgba(34, 197, 94, 0.15)",
                    border: "1px solid #22c55e",
                    color: "#4ade80",
                    fontSize: "11px",
                    fontWeight: "700",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    textTransform: "uppercase",
                  }}
                >
                  Verified ERP Account
                </span>
                <span
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    color: "#fff",
                    fontSize: "11px",
                    fontWeight: "600",
                    padding: "2px 8px",
                    borderRadius: "4px",
                  }}
                >
                  {user.accountType}
                </span>
              </div>
              <h1 style={{ margin: "10px 0 6px", fontSize: "clamp(24px, 3.2vw, 36px)", fontWeight: "750", color: "#fff" }}>
                Welcome, {user.fullName}
              </h1>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.75)", fontSize: "14px" }}>
                {user.companyName ? `${user.companyName} · ` : ""}
                {user.email} · {user.phone}
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="button red"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px 18px",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                <Plus size={16} /> New Request
              </button>
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff",
                  padding: "10px 16px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontWeight: "500",
                }}
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="shell" style={{ marginTop: "32px" }}>
        {/* Metric Overview Strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          <div style={{ background: "#fff", border: "1px solid var(--line, #d7d1c8)", borderRadius: "10px", padding: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.02)" }}>
            <div style={{ fontSize: "12px", color: "var(--muted, #6f706f)", textTransform: "uppercase", fontWeight: "600", marginBottom: "4px" }}>
              Enrolled Services
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "var(--ink, #111214)" }}>
              {user.selectedServices?.length || 0}
            </div>
            <div style={{ fontSize: "12px", color: "var(--ink-soft, #303238)", marginTop: "4px" }}>
              Configured on AAU Chamo ERP
            </div>
          </div>

          <div style={{ background: "#fff", border: "1px solid var(--line, #d7d1c8)", borderRadius: "10px", padding: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.02)" }}>
            <div style={{ fontSize: "12px", color: "var(--muted, #6f706f)", textTransform: "uppercase", fontWeight: "600", marginBottom: "4px" }}>
              Active Enquiries & Requests
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "var(--red, #c90812)" }}>
              {requests.length}
            </div>
            <div style={{ fontSize: "12px", color: "var(--ink-soft, #303238)", marginTop: "4px" }}>
              Directly monitored by operations
            </div>
          </div>

          <div style={{ background: "#fff", border: "1px solid var(--line, #d7d1c8)", borderRadius: "10px", padding: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.02)" }}>
            <div style={{ fontSize: "12px", color: "var(--muted, #6f706f)", textTransform: "uppercase", fontWeight: "600", marginBottom: "4px" }}>
              Assigned Operations Desk
            </div>
            <div style={{ fontSize: "18px", fontWeight: "750", color: "var(--ink, #111214)" }}>
              Kano Airport HQ
            </div>
            <div style={{ fontSize: "12px", color: "#16a34a", fontWeight: "600", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#16a34a", display: "inline-block" }} />
              Live Operations Online
            </div>
          </div>

          <div style={{ background: "#fff", border: "1px solid var(--line, #d7d1c8)", borderRadius: "10px", padding: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.02)" }}>
            <div style={{ fontSize: "12px", color: "var(--muted, #6f706f)", textTransform: "uppercase", fontWeight: "600", marginBottom: "4px" }}>
              Quick AWB Tracking
            </div>
            <Link
              href="/track-cargo"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "14px",
                fontWeight: "700",
                color: "var(--red, #c90812)",
                marginTop: "6px",
              }}
            >
              Search AWB / Consignment <ArrowUpRight size={16} />
            </Link>
            <div style={{ fontSize: "12px", color: "var(--muted, #6f706f)", marginTop: "4px" }}>
              Instant live status updates
            </div>
          </div>
        </div>

        {/* Selected Services Section */}
        <div style={{ marginBottom: "36px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "750", color: "var(--ink, #111214)" }}>
                Your Active Services Portfolio
              </h2>
              <p style={{ margin: "4px 0 0", fontSize: "14px", color: "var(--muted, #6f706f)" }}>
                Services selected during your onboarding. Click to initiate a dedicated request or booking.
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            {user.selectedServices.map((svcName) => (
              <div
                key={svcName}
                style={{
                  background: "#fff",
                  border: "1px solid var(--line, #d7d1c8)",
                  borderRadius: "10px",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "8px",
                        background: "rgba(201, 8, 18, 0.08)",
                        color: "var(--red, #c90812)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {svcName.toLowerCase().includes("flight") ? (
                        <Plane size={18} />
                      ) : svcName.toLowerCase().includes("courier") ? (
                        <Truck size={18} />
                      ) : svcName.toLowerCase().includes("customs") ? (
                        <FileText size={18} />
                      ) : (
                        <Package size={18} />
                      )}
                    </div>
                    <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "var(--ink, #111214)" }}>
                      {svcName}
                    </h3>
                  </div>
                  <p style={{ margin: 0, fontSize: "13px", color: "var(--ink-soft, #303238)", lineHeight: "1.5" }}>
                    Direct line with our specialized department desk. Fast turnaround and transparent quotations.
                  </p>
                </div>

                <div style={{ marginTop: "18px", borderTop: "1px solid #f1f5f9", paddingTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}>
                    <CheckCircle2 size={14} /> Active on ERP
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setReqType(svcName);
                      setModalOpen(true);
                    }}
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      color: "var(--red, #c90812)",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: "4px 8px",
                    }}
                  >
                    Request Now →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Requests & Tracking History */}
        <div style={{ background: "#fff", border: "1px solid var(--line, #d7d1c8)", borderRadius: "12px", padding: "28px 24px", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", marginBottom: "36px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "750", color: "var(--ink, #111214)" }}>
                Your Service Requests & Enquiries
              </h2>
              <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--muted, #6f706f)" }}>
                Every request submitted here creates a trackable record in the AAU Chamo ERP system.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="button light"
              style={{ fontSize: "13px", padding: "8px 14px" }}
            >
              + Submit New Request
            </button>
          </div>

          {requests.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", background: "var(--paper, #f4f1eb)", borderRadius: "8px" }}>
              <Package size={36} style={{ color: "var(--muted, #6f706f)", margin: "0 auto 12px" }} />
              <h3 style={{ margin: "0 0 6px", fontSize: "16px", fontWeight: "700" }}>No Requests Submitted Yet</h3>
              <p style={{ margin: "0 0 16px", fontSize: "13px", color: "var(--muted, #6f706f)", maxWidth: "420px", marginInline: "auto" }}>
                Need cargo freight rates, flight bookings, or customs clearing? Click the button below to submit your first request.
              </p>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="button red"
                style={{ fontSize: "13px", padding: "10px 20px" }}
              >
                Create First Request
              </button>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--line, #d7d1c8)", color: "var(--muted, #6f706f)", fontSize: "12px", textTransform: "uppercase" }}>
                    <th style={{ padding: "12px 10px" }}>Reference</th>
                    <th style={{ padding: "12px 10px" }}>Service Type</th>
                    <th style={{ padding: "12px 10px" }}>Message / Note</th>
                    <th style={{ padding: "12px 10px" }}>Status</th>
                    <th style={{ padding: "12px 10px" }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r) => (
                    <tr key={r.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "14px 10px", fontWeight: "700", fontFamily: "monospace", color: "var(--ink, #111214)" }}>
                        {r.reference}
                      </td>
                      <td style={{ padding: "14px 10px", fontWeight: "600" }}>{r.type}</td>
                      <td style={{ padding: "14px 10px", color: "var(--ink-soft, #303238)", maxWidth: "300px" }}>
                        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {r.message}
                        </div>
                      </td>
                      <td style={{ padding: "14px 10px" }}>
                        <span
                          style={{
                            background: r.status === "New" ? "#fef3c7" : r.status === "Completed" ? "#dcfce7" : "#e0e7ff",
                            color: r.status === "New" ? "#92400e" : r.status === "Completed" ? "#166534" : "#3730a3",
                            fontSize: "11px",
                            fontWeight: "700",
                            padding: "3px 8px",
                            borderRadius: "4px",
                            textTransform: "uppercase",
                          }}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td style={{ padding: "14px 10px", fontSize: "12px", color: "var(--muted, #6f706f)" }}>
                        {new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Operations Desk Direct Connection */}
        <div style={{ background: "linear-gradient(135deg, #111214 0%, #202227 100%)", borderRadius: "12px", padding: "32px", color: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px" }}>
            <div>
              <span className="eyebrow" style={{ color: "var(--red, #c90812)" }}>Direct Operations Support</span>
              <h3 style={{ margin: "8px 0 6px", fontSize: "22px", fontWeight: "750", color: "#fff" }}>
                Need urgent cargo clearance or flight changes?
              </h3>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.75)", fontSize: "14px", maxWidth: "560px" }}>
                Our Kano operations hub and station officers are available round the clock. Connect directly via WhatsApp or call our central line.
              </p>
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <a
                href="https://wa.me/2349168340588"
                target="_blank"
                rel="noreferrer"
                style={{
                  background: "#22c55e",
                  color: "#fff",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  fontWeight: "700",
                  fontSize: "14px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <MessageSquare size={16} /> WhatsApp Desk (+234 916 834 0588)
              </a>
              <a
                href="mailto:aauchamo@gmail.com"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "14px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Mail size={16} /> Email Operations
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* New Request Modal */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#fff",
              width: "100%",
              maxWidth: "520px",
              borderRadius: "14px",
              padding: "32px",
              boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
              position: "relative",
            }}
          >
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "var(--muted, #6f706f)",
              }}
            >
              <X size={20} />
            </button>

            <h3 style={{ margin: "0 0 6px", fontSize: "20px", fontWeight: "750", color: "var(--ink, #111214)" }}>
              Submit Service Request
            </h3>
            <p style={{ margin: "0 0 20px", fontSize: "13px", color: "var(--muted, #6f706f)" }}>
              This request will be routed immediately to our ERP operations officers.
            </p>

            {submitError && (
              <div style={{ background: "#fef2f2", color: "#991b1b", padding: "10px 14px", borderRadius: "6px", fontSize: "13px", marginBottom: "16px" }}>
                {submitError}
              </div>
            )}
            {submitSuccess && (
              <div style={{ background: "#dcfce7", color: "#166534", padding: "10px 14px", borderRadius: "6px", fontSize: "13px", marginBottom: "16px" }}>
                {submitSuccess}
              </div>
            )}

            <form onSubmit={handleCreateRequest} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--ink, #111214)", marginBottom: "6px" }}>
                  Service Category
                </label>
                <select
                  value={reqType}
                  onChange={(e) => setReqType(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--line, #d7d1c8)", fontSize: "14px" }}
                >
                  {user.selectedServices.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                  <option value="General Logistics Enquiry">Other / General Request</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--ink, #111214)", marginBottom: "6px" }}>
                  Request Details / Instructions
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide consignment weight, origin, destination, preferred flight dates, or container details..."
                  value={reqMessage}
                  onChange={(e) => setReqMessage(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--line, #d7d1c8)", fontSize: "14px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="button light"
                  style={{ padding: "10px 16px", fontSize: "13px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="button red"
                  style={{ padding: "10px 20px", fontSize: "13px", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  {submitting ? "Submitting..." : "Send Request"} <Send size={14} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
