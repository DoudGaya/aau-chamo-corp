"use client";

import { AlertCircle, LoaderCircle, Search } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

const statuses = ["Received", "Processing", "Dispatched", "In Transit", "Arrived", "Ready for Collection", "Delivered"];
type Result = { reference: string; status: string; description: string; updatedAt?: string; source: "inventory" | "enquiry" };

async function requestTracking(code: string) {
  const response = await fetch(`/api/tracking/${encodeURIComponent(code)}`, { cache: "no-store" });
  const body = await response.json() as Result & { error?: string };
  if (!response.ok) throw new Error(body.error || "No customer-facing status is available for that reference.");
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
    setBusy(true); setError(""); setResult(null);
    try {
      setResult(await requestTracking(code));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Tracking is temporarily unavailable.");
    } finally { setBusy(false); }
  }

  useEffect(() => {
    if (!initialReference) return;
    let active = true;
    requestTracking(initialReference)
      .then((data) => { if (active) setResult(data); })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "Tracking is temporarily unavailable."); })
      .finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, [initialReference]);

  function submit(event: FormEvent) { event.preventDefault(); void track(reference); }
  const currentIndex = result ? Math.max(0, statuses.indexOf(result.status)) : -1;

  return (
    <div className="track-panel">
      <form className="track-search" onSubmit={submit}>
        <label className="sr-only" htmlFor="tracking-reference">Tracking number</label>
        <input id="tracking-reference" value={reference} onChange={(event) => setReference(event.target.value)} maxLength={40} placeholder="Enter tracking or enquiry reference" />
        <button className="button red" type="submit" disabled={busy}>{busy ? <LoaderCircle className="spin" size={18} /> : <Search size={18} />} Track</button>
      </form>
      {error ? <div className="form-note error" role="alert"><AlertCircle size={18} /> {error}</div> : null}
      {result ? (
        <div className="tracking-result" aria-live="polite">
          <div className="tracking-result-head">
            <div><span className="news-meta">{result.source === "inventory" ? "Shipment status" : "Enquiry status"}</span><strong>{result.reference}</strong></div>
            <span>{result.updatedAt ? new Date(result.updatedAt).toLocaleString("en-NG") : "Current status"}</span>
          </div>
          {result.source === "inventory" ? (
            <div className="status-timeline">
              {statuses.map((status, index) => <div className={`status-node ${index < currentIndex ? "complete" : index === currentIndex ? "current" : ""}`} key={status}>{status}</div>)}
            </div>
          ) : <div style={{ padding: 28 }}><strong>{result.status}</strong><p className="muted">{result.description}</p></div>}
        </div>
      ) : null}
      <div className="form-note"><AlertCircle size={17} /><span>Tracking results show customer-safe information only. An enquiry reference indicates request progress; it is not a confirmed shipment or booking.</span></div>
    </div>
  );
}
