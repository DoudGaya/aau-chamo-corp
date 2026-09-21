"use client";

import { AlertCircle, CheckCircle2, LoaderCircle, LockKeyhole } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

const types = [
  ["flight", "Flight booking"],
  ["cargo", "Cargo / logistics"],
  ["courier", "Courier / delivery"],
  ["umrah", "Umrah & Ziyarah"],
  ["visa", "Visa assistance"],
  ["travel", "Travel services"],
  ["general", "General enquiry"],
] as const;

type SubmitState = { status: "idle" | "busy" | "success" | "error"; message?: string; reference?: string; emailSent?: boolean };

const specificFields: Record<string, { name: string; label: string; type?: string; placeholder?: string; full?: boolean; required?: boolean }[]> = {
  flight: [
    { name: "departure", label: "Departure", placeholder: "City or airport", required: true },
    { name: "destination", label: "Destination", placeholder: "City or airport", required: true },
    { name: "travelDate", label: "Travel date", type: "date", required: true },
    { name: "passengers", label: "Passengers", type: "number", required: true },
  ],
  cargo: [
    { name: "sender", label: "Sender name", required: true },
    { name: "receiver", label: "Receiver name", required: true },
    { name: "origin", label: "Origin", required: true },
    { name: "destination", label: "Destination", required: true },
    { name: "cargoType", label: "Cargo type", required: true },
    { name: "weight", label: "Weight (kg)", type: "number", required: true },
    { name: "preferredDate", label: "Preferred date", type: "date", required: true },
    { name: "deliveryOption", label: "Delivery option", placeholder: "Airport-to-airport, door-to-airport…", required: true },
  ],
  courier: [
    { name: "pickupLocation", label: "Pickup location", required: true },
    { name: "deliveryLocation", label: "Delivery location", required: true },
    { name: "preferredDate", label: "Preferred date", type: "date", required: true },
    { name: "packageDetails", label: "Package details", placeholder: "Contents, size and handling needs", full: true, required: true },
  ],
  umrah: [
    { name: "travellers", label: "Number of travellers", type: "number", required: true },
    { name: "preferredDate", label: "Preferred date", type: "date", required: true },
    { name: "packageInterest", label: "Package interest", placeholder: "Tell us the support you need", full: true, required: true },
  ],
  visa: [
    { name: "country", label: "Destination country", required: true },
    { name: "nationality", label: "Nationality", required: true },
    { name: "travelPurpose", label: "Travel purpose", required: true },
    { name: "travelDate", label: "Travel date", type: "date", required: true },
  ],
  travel: [
    { name: "serviceType", label: "Travel service", required: true },
    { name: "destination", label: "Destination", required: true },
    { name: "travelDate", label: "Preferred date", type: "date", required: true },
  ],
  general: [
    { name: "subject", label: "Subject", full: true, required: true },
  ],
};

export function EnquiryForm({ defaultType = "cargo" }: { defaultType?: string }) {
  const safeDefault = types.some(([value]) => value === defaultType) ? defaultType : "cargo";
  const [type, setType] = useState(safeDefault);
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  const fields = useMemo(() => specificFields[type] || specificFields.general, [type]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setState({ status: "busy" });
    const form = new FormData(event.currentTarget);
    const details: Record<string, string> = {};
    for (const field of fields) details[field.name] = String(form.get(field.name) || "").trim();
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type,
          name: String(form.get("name") || ""),
          email: String(form.get("email") || ""),
          phone: String(form.get("phone") || ""),
          message: String(form.get("message") || ""),
          company: String(form.get("company") || ""),
          consent: form.get("consent") === "on",
          details,
        }),
      });
      const body = await response.json() as { ok?: boolean; reference?: string; emailSent?: boolean; error?: string };
      if (!response.ok || !body.ok || !body.reference) throw new Error(body.error || "Your enquiry could not be submitted.");
      formElement.reset();
      setType(safeDefault);
      setState({ status: "success", reference: body.reference, emailSent: body.emailSent, message: "Your request has been received for staff review." });
    } catch (error) {
      setState({ status: "error", message: error instanceof Error ? error.message : "Your enquiry could not be submitted." });
    }
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <div className="form-grid">
        <div className="field full">
          <label htmlFor="enquiry-type">How can we help?</label>
          <select id="enquiry-type" name="type" value={type} onChange={(event) => setType(event.target.value)}>
            {types.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        <div className="field"><label htmlFor="name">Full name</label><input id="name" name="name" autoComplete="name" required minLength={2} /></div>
        <div className="field"><label htmlFor="phone">Phone number</label><input id="phone" name="phone" type="tel" autoComplete="tel" required minLength={7} /></div>
        <div className="field full"><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" required /></div>
        {fields.map((field) => (
          <div className={`field ${field.full ? "full" : ""}`} key={`${type}-${field.name}`}>
            <label htmlFor={field.name}>{field.label}</label>
            <input id={field.name} name={field.name} type={field.type || "text"} placeholder={field.placeholder} required={field.required} min={field.type === "number" ? 1 : undefined} step={field.name === "weight" ? "0.01" : undefined} />
          </div>
        ))}
        <div className="field full"><label htmlFor="message">Additional requirements</label><textarea id="message" name="message" maxLength={2000} placeholder="Share any timing, handling or service requirements." /></div>
        <div className="field sr-only" aria-hidden="true"><label htmlFor="company">Company website</label><input id="company" name="company" tabIndex={-1} autoComplete="off" /></div>
        <label className="form-note full"><input type="checkbox" name="consent" required /> <span>I agree that A.A.U Chamo may use these details to process and follow up this enquiry.</span></label>
      </div>
      {state.status === "success" ? (
        <div className="reference-box" role="status">
          <strong>{state.reference}</strong>
          <span>{state.message} {state.emailSent ? "An acknowledgement has been sent to your email." : "Keep this reference for follow-up."}</span>
        </div>
      ) : null}
      {state.status === "error" ? <div className="form-note error" role="alert"><AlertCircle size={18} /> {state.message}</div> : null}
      <div className="form-actions">
        <span className="muted" style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 8 }}><LockKeyhole size={15} /> Secure request · no automatic booking confirmation</span>
        <button className="button red" type="submit" disabled={state.status === "busy"}>
          {state.status === "busy" ? <><LoaderCircle size={18} className="spin" /> Submitting</> : state.status === "success" ? <><CheckCircle2 size={18} /> Send another</> : "Submit enquiry"}
        </button>
      </div>
    </form>
  );
}
