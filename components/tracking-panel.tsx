"use client";

import { AlertCircle, CheckCircle2, Clock, LoaderCircle, Package, Search } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

const statuses = ["Received", "Processing", "Dispatched", "In Transit", "Arrived", "Ready for Collection", "Delivered"];

type TrackingEvent = {
  id: string;
  status: string;
  location?: string | null;
  notes?: string | null;
  occurredAt: string;
};

type Result = {
  reference: string;
  status: string;
  rawStatus?: string;
  description: string;
  updatedAt?: string;
  origin?: string;
  destination?: string;
  pieces?: number;
  weightKg?: string;
  commodity?: string;
  estimatedDelivery?: string;
  events?: TrackingEvent[];
  source: "inventory" | "enquiry";
};

async function requestTracking(code: string): Promise<Result> {
  const response = await fetch(`/api/tracking/${encodeURIComponent(code)}`, { cache: "no-store" });
  let body: (Result & { error?: string }) | null = null;
  try {
    body = (await response.json()) as Result & { error?: string };
  } catch {
    throw new Error(
      response.ok
        ? "Received an unexpected response from tracking service. Please retry in a few moments."
        : `Tracking service temporarily unavailable (${response.status}). Please try again shortly.`
    );
  }
  if (!response.ok || !body) {
    throw new Error(body?.error || "No customer-facing status is available for that reference.");
  }
  return body;
}

export function TrackingPanel({ initialReference = "" }: { initialReference?: string }) {
  const [reference, setReference] = useState(initialReference);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(Boolean(initialReference));

  async function track(value: string) {
    const code = value.trim();
    if (!code) return;
    setBusy(true);
    setError("");
    setResult(null);
    try {
      setResult(await requestTracking(code));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Tracking is temporarily unavailable.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (!initialReference) return;
    let active = true;
    requestTracking(initialReference)
      .then((data) => {
        if (active) setResult(data);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Tracking is temporarily unavailable.");
      })
      .finally(() => {
        if (active) setBusy(false);
      });
    return () => {
      active = false;
    };
  }, [initialReference]);

  function submit(event: FormEvent) {
    event.preventDefault();
    void track(reference);
  }

  const currentIndex = result ? Math.max(0, statuses.indexOf(result.status)) : -1;

  return (
    <div className="track-panel">
      <form className="track-search" onSubmit={submit}>
        <label className="sr-only" htmlFor="tracking-reference">Tracking number</label>
        <input
          id="tracking-reference"
          value={reference}
          onChange={(event) => setReference(event.target.value)}
          maxLength={50}
          placeholder="Enter Air Waybill (e.g. AWB-20261002-000035)"
        />
        <button className="button red" type="submit" disabled={busy}>
          {busy ? <LoaderCircle className="spin" size={18} /> : <Search size={18} />} Track
        </button>
      </form>

      {error ? (
        <div className="form-note error" role="alert">
          <AlertCircle size={18} /> {error}
        </div>
      ) : null}

      {result ? (
        <div className="tracking-result" aria-live="polite">
          <div className="tracking-result-head">
            <div>
              <span className="news-meta">
                {result.source === "inventory" ? "Air Waybill (AWB) Shipment" : "Customer Enquiry"}
              </span>
              <strong>{result.reference}</strong>
            </div>
            <span>
              {result.updatedAt ? new Date(result.updatedAt).toLocaleString("en-NG") : "Current status"}
            </span>
          </div>

          {(result.origin || result.destination || result.pieces || result.weightKg || result.commodity || result.estimatedDelivery) ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px 32px", padding: "16px 24px", background: "var(--paper)", borderBottom: "1px solid var(--line)", fontSize: "13px" }}>
              {result.origin && <span><strong>Origin:</strong> {result.origin}</span>}
              {result.destination && <span><strong>Destination:</strong> {result.destination}</span>}
              {result.commodity && <span><strong>Cargo:</strong> {result.commodity}</span>}
              {result.pieces !== undefined && <span><strong>Pieces:</strong> {result.pieces}</span>}
              {result.weightKg && <span><strong>Weight:</strong> {result.weightKg} kg</span>}
              {result.estimatedDelivery && (
                <span><strong>Estimated Arrival:</strong> {new Date(result.estimatedDelivery).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}</span>
              )}
            </div>
          ) : null}

          {result.source === "inventory" ? (
            <>
              <div className="status-timeline">
                {statuses.map((status, index) => (
                  <div
                    className={`status-node ${index < currentIndex ? "complete" : index === currentIndex ? "current" : ""}`}
                    key={status}
                  >
                    {status}
                  </div>
                ))}
              </div>

              {result.events && result.events.length > 0 && (
                <div style={{ padding: "20px 24px", borderTop: "1px solid var(--line)", background: "var(--paper)" }}>
                  <h4 style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted)", margin: "0 0 12px 0" }}>
                    Shipment Milestones
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {result.events.map((evt) => (
                      <div key={evt.id} style={{ display: "flex", alignItems: "flex-start", gap: "12px", fontSize: "13px" }}>
                        <Clock size={15} style={{ marginTop: "2px", color: "var(--red)", flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <span style={{ fontWeight: 600 }}>{evt.status.replace(/_/g, " ")}</span>
                          {evt.notes && <span style={{ color: "var(--muted)", marginLeft: "8px" }}>— {evt.notes}</span>}
                          {evt.location && <span style={{ color: "var(--muted)", marginLeft: "8px" }}>({evt.location})</span>}
                        </div>
                        <time style={{ color: "var(--muted)", fontSize: "12px", whiteSpace: "nowrap" }}>
                          {new Date(evt.occurredAt).toLocaleString("en-NG", { dateStyle: "short", timeStyle: "short" })}
                        </time>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ padding: 28 }}>
              <div style={{ display: "inline-block", background: "var(--red)", color: "white", padding: "4px 10px", fontSize: "12px", fontWeight: "700", marginBottom: "12px", textTransform: "uppercase", letterSpacing: ".05em" }}>
                {result.status}
              </div>
              <p className="muted" style={{ margin: 0, lineHeight: 1.6 }}>{result.description}</p>
            </div>
          )}
        </div>
      ) : null}

      <div className="form-note">
        <AlertCircle size={17} />
        <span>Tracking results show customer-safe logistics milestones. For live flight manifests or customs clearances, contact cargo support.</span>
      </div>
    </div>
  );
}

