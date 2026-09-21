import "server-only";

import type { EnquiryRecord } from "@/lib/enquiries";
import { siteConfig } from "@/lib/site";

const departmentEmails: Record<string, string | undefined> = {
  cargo: process.env.CARGO_ENQUIRY_EMAIL,
  courier: process.env.CARGO_ENQUIRY_EMAIL,
  flight: process.env.TRAVEL_ENQUIRY_EMAIL,
  visa: process.env.TRAVEL_ENQUIRY_EMAIL,
  travel: process.env.TRAVEL_ENQUIRY_EMAIL,
  umrah: process.env.UMRAH_ENQUIRY_EMAIL || process.env.TRAVEL_ENQUIRY_EMAIL,
  general: process.env.GENERAL_ENQUIRY_EMAIL,
};

async function sendResendEmail(to: string[], subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_FROM_EMAIL;
  if (!apiKey || !from) return false;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({ from, to, subject, html }),
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error(`Email provider returned ${response.status}.`);
  return true;
}

export async function notifyEnquiry(record: EnquiryRecord) {
  const detailRows = Object.entries(record.details)
    .filter(([, value]) => value)
    .map(([key, value]) => `<tr><td style="padding:6px 12px;color:#666">${escapeHtml(key)}</td><td style="padding:6px 12px"><strong>${escapeHtml(value)}</strong></td></tr>`)
    .join("");
  const staffEmail = departmentEmails[record.type] || process.env.GENERAL_ENQUIRY_EMAIL;
  const customerHtml = `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto"><h1 style="color:#c90812">Request received</h1><p>Hello ${escapeHtml(record.name)},</p><p>Your ${escapeHtml(record.type)} enquiry has been received for staff review.</p><p style="font-size:22px"><strong>${record.reference}</strong></p><p>This is an enquiry acknowledgement, not a confirmed booking, price or transaction.</p><p>A.A.U Chamo Customer Service<br>${escapeHtml(siteConfig.email)}</p></div>`;
  const staffHtml = `<div style="font-family:Arial,sans-serif;max-width:720px;margin:auto"><h1>New website enquiry</h1><p><strong>${record.reference}</strong> · ${escapeHtml(record.type)}</p><table style="border-collapse:collapse;width:100%"><tr><td style="padding:6px 12px;color:#666">Customer</td><td style="padding:6px 12px"><strong>${escapeHtml(record.name)}</strong></td></tr><tr><td style="padding:6px 12px;color:#666">Email</td><td style="padding:6px 12px">${escapeHtml(record.email)}</td></tr><tr><td style="padding:6px 12px;color:#666">Phone</td><td style="padding:6px 12px">${escapeHtml(record.phone)}</td></tr>${detailRows}</table><p>${escapeHtml(record.message || "No additional message")}</p></div>`;
  const results = await Promise.all([
    sendResendEmail([record.email], `A.A.U Chamo enquiry ${record.reference}`, customerHtml),
    staffEmail ? sendResendEmail([staffEmail], `New ${record.type} enquiry · ${record.reference}`, staffHtml) : Promise.resolve(false),
  ]);
  return results.some(Boolean);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] || character);
}
