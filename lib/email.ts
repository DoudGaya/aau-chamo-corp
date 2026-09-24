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
  const staffEmail = departmentEmails[record.type] || process.env.GENERAL_ENQUIRY_EMAIL;
  
  const customerHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #111214; padding: 32px 24px; text-align: center; border-bottom: 4px solid #c90812;">
        <h2 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">A.A.U CHAMO</h2>
      </div>
      <div style="padding: 40px 32px;">
        <h1 style="color: #111214; font-size: 20px; margin-top: 0; margin-bottom: 24px;">Request Received</h1>
        <p style="color: #444444; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">Hello ${escapeHtml(record.name)},</p>
        <p style="color: #444444; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">Your <strong>${escapeHtml(record.type)}</strong> enquiry has been received and our team is currently reviewing it. We will get back to you shortly.</p>
        
        <div style="background-color: #f7f7f7; border-left: 4px solid #c90812; padding: 16px 20px; margin-bottom: 32px;">
          <p style="color: #666666; font-size: 14px; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 0.05em;">Your Reference Code</p>
          <p style="color: #111214; font-size: 24px; font-weight: 700; margin: 0; font-family: monospace;">${record.reference}</p>
        </div>
        
        <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 0 0 32px 0;">
          <em>Note: This is an automated acknowledgement of your enquiry, not a confirmed booking, price, or transaction.</em>
        </p>
        
        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 0 0 32px 0;" />
        
        <p style="color: #444444; font-size: 16px; margin: 0 0 4px 0;">Best regards,</p>
        <p style="color: #111214; font-size: 16px; font-weight: 600; margin: 0;">A.A.U Chamo Customer Service</p>
        <p style="color: #c90812; font-size: 14px; margin: 4px 0 0 0;">
          <a href="mailto:${escapeHtml(siteConfig.email)}" style="color: #c90812; text-decoration: none;">${escapeHtml(siteConfig.email)}</a>
        </p>
      </div>
      <div style="background-color: #f7f7f7; padding: 24px 32px; text-align: center; border-top: 1px solid #eaeaea;">
        <p style="color: #888888; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase;">${escapeHtml(siteConfig.legalName)}</p>
        <p style="color: #888888; font-size: 12px; margin: 0;">${escapeHtml(siteConfig.address)}</p>
      </div>
    </div>
  `;

  const staffHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #111214; padding: 24px; border-bottom: 4px solid #c90812;">
        <h2 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 500;">New Website Enquiry <span style="background-color: #c90812; color: #ffffff; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase; float: right;">${escapeHtml(record.type)}</span></h2>
      </div>
      <div style="padding: 32px 24px;">
        <div style="margin-bottom: 24px;">
          <p style="color: #666666; font-size: 13px; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 0.05em;">Reference Code</p>
          <p style="color: #111214; font-size: 24px; font-weight: 700; margin: 0; font-family: monospace;">${record.reference}</p>
        </div>

        <h3 style="color: #111214; font-size: 16px; margin: 0 0 16px 0; border-bottom: 1px solid #eaeaea; padding-bottom: 8px;">Customer Details</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666666; width: 35%; font-size: 14px;">Name</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #111214; font-weight: 600; font-size: 14px;">${escapeHtml(record.name)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666666; font-size: 14px;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #111214; font-weight: 600; font-size: 14px;"><a href="mailto:${escapeHtml(record.email)}" style="color: #c90812; text-decoration: none;">${escapeHtml(record.email)}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666666; font-size: 14px;">Phone</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #111214; font-weight: 600; font-size: 14px;">${escapeHtml(record.phone)}</td>
          </tr>
        </table>

        <h3 style="color: #111214; font-size: 16px; margin: 0 0 16px 0; border-bottom: 1px solid #eaeaea; padding-bottom: 8px;">Enquiry Specifications</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
          ${Object.entries(record.details).filter(([, value]) => value).map(([key, value]) => \`
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666666; width: 35%; font-size: 14px;">\${escapeHtml(key)}</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #111214; font-weight: 600; font-size: 14px;">\${escapeHtml(value)}</td>
          </tr>\`).join("")}
        </table>

        <h3 style="color: #111214; font-size: 16px; margin: 0 0 12px 0;">Additional Message</h3>
        <div style="background-color: #f7f7f7; padding: 16px; border-radius: 6px; color: #444444; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
          ${escapeHtml(record.message || "No additional message provided.")}
        </div>
      </div>
    </div>
  `;
  const results = await Promise.all([
    sendResendEmail([record.email], `A.A.U Chamo enquiry ${record.reference}`, customerHtml),
    staffEmail ? sendResendEmail([staffEmail], `New ${record.type} enquiry · ${record.reference}`, staffHtml) : Promise.resolve(false),
  ]);
  return results.some(Boolean);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] || character);
}
