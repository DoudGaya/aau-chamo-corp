import "server-only";

import { services } from "@/lib/content";

const unsafeClaims = /\b(price|cost|fare|available|availability|confirmed|guarantee|delivery time|how long|booked)\b/i;
const currencyClaims = /(?:₦|\bNGN\b|\bUSD\b|\$)\s?\d/i;

const safetyReply = "I cannot verify prices, live availability, delivery timelines or booking confirmations. I can collect your request for an authorised A.A.U Chamo staff member to review. Use Book / Enquire and keep the reference number you receive.";

export async function answerAssistant(message: string, history: { role: string; content: string }[]) {
  if (unsafeClaims.test(message)) return safetyReply;

  const lower = message.toLowerCase();
  const matched = services.find((service) => {
    const terms = `${service.title} ${service.shortTitle} ${service.slug}`.toLowerCase().split(/[\s&-]+/).filter((term) => term.length > 4);
    return terms.some((term) => lower.includes(term));
  });

  const endpoint = process.env.AI_ASSISTANT_ENDPOINT;
  if (endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(process.env.AI_ASSISTANT_TOKEN ? { authorization: `Bearer ${process.env.AI_ASSISTANT_TOKEN}` } : {}),
        },
        body: JSON.stringify({
          message,
          history: history.slice(-8),
          rules: [
            "Use only the supplied approved knowledge.",
            "Never invent prices, availability, delivery timelines, policies, confirmations or transactions.",
            "Clearly label enquiries and requests as unconfirmed.",
            "Escalate uncertain or complex requests to staff.",
          ],
          knowledge: services.map(({ title, summary, description, benefits }) => ({ title, summary, description, benefits })),
        }),
        signal: AbortSignal.timeout(15_000),
      });
      if (response.ok) {
        const body = await response.json() as { answer?: unknown };
        const answer = typeof body.answer === "string" ? body.answer.trim().slice(0, 1800) : "";
        if (answer && !unsafeClaims.test(answer) && !currencyClaims.test(answer)) return answer;
      }
    } catch {
      // The controlled knowledge-base response below remains available.
    }
  }

  if (/human|agent|staff|whatsapp|person/i.test(message)) {
    return "I can hand this to a person. Open the green WhatsApp button or submit the Book / Enquire form. If you submit the form first, include the reference number in your WhatsApp message.";
  }
  if (/track|shipment|cargo status/i.test(message)) {
    return "Use Track Cargo and enter the tracking number issued by staff. If you only have an enquiry reference, the page can show request progress, which is separate from live shipment status.";
  }
  if (matched) {
    return `${matched.title}: ${matched.description}\n\nThe usual process is ${matched.process.map((step) => step.title.toLowerCase()).join(", then ")}. Would you like to submit an enquiry for staff review?`;
  }
  if (/cargo|send|kg|package|parcel|courier/i.test(message)) {
    return "For a cargo or courier request, please prepare your name, phone, email, origin, destination, cargo type, weight, preferred date and delivery option. I can guide the request, but operations staff must confirm price, capacity and timing.";
  }
  if (/flight|ticket|travel/i.test(message)) {
    return "For a flight request, prepare the departure, destination, travel date, passenger count and any special requirements. Submitting the request does not reserve a seat; staff will verify options before confirmation.";
  }
  if (/umrah|ziyar/i.test(message)) {
    return "For Umrah or Ziyarah, share the primary contact, number of travellers, preferred date and package interest. Current package details are provided only after staff verification.";
  }
  return "I can help with cargo and logistics, courier delivery, flight requests, visa assistance, travel insurance, baggage handling, Umrah and Ziyarah, clearing and forwarding, or international trade services. Which service do you need?";
}
