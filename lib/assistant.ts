import "server-only";

import OpenAI from "openai";
import { z } from "zod";
import { services } from "@/lib/content";
import { enquiryInputSchema, missingEnquiryDetails } from "@/lib/enquiry-validation";
import { submitEnquiry } from "@/lib/enquiry-service";

type HistoryMessage = { role: "user" | "assistant"; content: string };

export type AssistantResult = {
  answer: string;
  provider: "openai" | "local-knowledge";
  enquiry?: { reference: string; status: string; emailSent: boolean };
};

const unsafeRequest = /\b(price|cost|fare|available|availability|confirmed|guarantee|delivery time|how long|booked)\b/i;
const currencyClaim = /(?:₦|\bNGN\b|\bUSD\b|\$|€|£)\s?\d/i;
const confirmationClaim = /\b(?:booking|reservation|shipment|transaction)\s+(?:is|has been|was)\s+(?:confirmed|completed|booked)\b/i;
const exactTimelineClaim = /\b(?:deliver|arriv)(?:e|ed|es|ing)?\s+(?:in|within|by)\s+\d/i;

const safetyReply = "I cannot verify prices, live availability, delivery timelines or booking confirmations. I can collect your request for an authorised A.A.U Chamo staff member to review. Use Book / Enquire, or tell me you want to start an enquiry.";

const detailKeys = [
  "departure", "destination", "travelDate", "passengers", "sender", "receiver", "origin",
  "cargoType", "weight", "preferredDate", "deliveryOption", "pickupLocation", "deliveryLocation",
  "packageDetails", "travellers", "packageInterest", "country", "nationality", "travelPurpose",
  "serviceType", "subject",
] as const;

const detailShape = Object.fromEntries(
  detailKeys.map((key) => [key, z.string().trim().max(500).nullable()]),
) as Record<(typeof detailKeys)[number], z.ZodNullable<z.ZodString>>;

const assistantEnquirySchema = z.object({
  type: z.enum(["flight", "cargo", "courier", "umrah", "visa", "travel", "general"]),
  name: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(40),
  message: z.string().trim().max(2000),
  consent: z.boolean(),
  details: z.object(detailShape),
});

const toolParameters = {
  type: "object",
  properties: {
    type: { type: "string", enum: ["flight", "cargo", "courier", "umrah", "visa", "travel", "general"] },
    name: { type: "string", description: "Customer's full name" },
    email: { type: "string", description: "Customer email address" },
    phone: { type: "string", description: "Customer phone number" },
    message: { type: "string", description: "Additional customer requirements, or an empty string" },
    consent: { type: "boolean", description: "True only when the customer explicitly asks to submit and consents to follow-up" },
    details: {
      type: "object",
      properties: Object.fromEntries(detailKeys.map((key) => [key, { type: ["string", "null"] }])),
      required: [...detailKeys],
      additionalProperties: false,
    },
  },
  required: ["type", "name", "email", "phone", "message", "consent", "details"],
  additionalProperties: false,
} as const;

function isUnsafeAnswer(answer: string) {
  return currencyClaim.test(answer) || confirmationClaim.test(answer) || exactTimelineClaim.test(answer);
}

function localAnswer(message: string): AssistantResult {
  if (unsafeRequest.test(message)) return { answer: safetyReply, provider: "local-knowledge" };

  const lower = message.toLowerCase();
  const matched = services.find((service) => {
    const terms = `${service.title} ${service.shortTitle} ${service.slug}`.toLowerCase().split(/[\s&-]+/).filter((term) => term.length > 4);
    return terms.some((term) => lower.includes(term));
  });

  if (/human|agent|staff|whatsapp|person/i.test(message)) {
    return { answer: "I can hand this to a person. Open the green WhatsApp button or submit the Book / Enquire form. If you submit the form first, include the reference number in your WhatsApp message.", provider: "local-knowledge" };
  }
  if (/track|shipment|cargo status/i.test(message)) {
    return { answer: "Use Track Cargo and enter the tracking number issued by staff. If you only have an enquiry reference, the page can show request progress, which is separate from live shipment status.", provider: "local-knowledge" };
  }
  if (matched) {
    return { answer: `${matched.title}: ${matched.description}\n\nThe usual process is ${matched.process.map((step) => step.title.toLowerCase()).join(", then ")}. Would you like to submit an enquiry for staff review?`, provider: "local-knowledge" };
  }
  if (/cargo|send|kg|package|parcel|courier/i.test(message)) {
    return { answer: "For a cargo or courier request, prepare your name, phone, email, origin, destination, cargo type, weight, preferred date and delivery option. I can guide the request, but operations staff must confirm price, capacity and timing.", provider: "local-knowledge" };
  }
  if (/flight|ticket|travel/i.test(message)) {
    return { answer: "For a flight request, prepare the departure, destination, travel date, passenger count and any special requirements. Submitting the request does not reserve a seat; staff will verify options before confirmation.", provider: "local-knowledge" };
  }
  if (/umrah|ziyar/i.test(message)) {
    return { answer: "For Umrah or Ziyarah, share the primary contact, number of travellers, preferred date and package interest. Current package details are provided only after staff verification.", provider: "local-knowledge" };
  }
  return { answer: "I can help with cargo and logistics, courier delivery, flight requests, visa assistance, travel insurance, baggage handling, Umrah and Ziyarah, clearing and forwarding, or international trade services. Which service do you need?", provider: "local-knowledge" };
}

function buildInstructions() {
  const knowledge = services.map(({ title, description, benefits, process, faqs }) => ({ title, description, benefits, process, faqs }));
  return `You are A.A.U Assist, the public customer-service assistant for A.A.U Chamo International Business Agency Services Limited.

Use only the approved company knowledge supplied below. Never invent or imply prices, fares, live availability, cargo capacity, delivery timelines, company policies, booking confirmations, completed transactions, or other unverified facts. Clearly distinguish an enquiry or request from a confirmed booking. Only authorised staff or a connected system can confirm a booking or transaction.

Help customers understand services and collect one structured enquiry at a time. Ask concise follow-up questions for missing required fields. Before using submit_enquiry, the customer must provide full name, valid email, phone, all service-required details, and explicitly agree that A.A.U Chamo may use the details to process and follow up the enquiry. Never infer consent. If the request is complex, uncertain, sensitive, or outside the approved knowledge, direct the customer to the enquiry form or WhatsApp.

Required service details:
- flight: departure, destination, travelDate, passengers
- cargo: sender, receiver, origin, destination, cargoType, weight, preferredDate, deliveryOption
- courier: pickupLocation, deliveryLocation, preferredDate, packageDetails
- umrah: travellers, preferredDate, packageInterest
- visa: country, nationality, travelPurpose, travelDate
- travel: serviceType, destination, travelDate
- general: subject

Approved knowledge: ${JSON.stringify(knowledge)}`;
}

export async function answerAssistant(message: string, history: HistoryMessage[], safetyIdentifier?: string): Promise<AssistantResult> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const model = process.env.OPENAI_MODEL?.trim();
  if (!apiKey || !model) return localAnswer(message);

  const prior = history.slice(-8);
  if (prior.at(-1)?.role === "user" && prior.at(-1)?.content.trim() === message.trim()) prior.pop();

  try {
    const openai = new OpenAI({ apiKey, timeout: 18_000, maxRetries: 2 });
    const response = await openai.responses.create({
      model,
      instructions: buildInstructions(),
      input: [...prior, { role: "user" as const, content: message }],
      tools: [{
        type: "function",
        name: "submit_enquiry",
        description: "Create an unconfirmed customer enquiry after all required details and explicit consent have been collected.",
        parameters: toolParameters,
        strict: true,
      }],
      tool_choice: "auto",
      parallel_tool_calls: false,
      max_output_tokens: 500,
      store: false,
      prompt_cache_key: "aau-chamo-public-assistant-v1",
      ...(safetyIdentifier ? { safety_identifier: safetyIdentifier } : {}),
    });

    const toolCall = response.output.find((item) => item.type === "function_call" && item.name === "submit_enquiry");
    if (toolCall?.type === "function_call") {
      const parsed = assistantEnquirySchema.safeParse(JSON.parse(toolCall.arguments));
      if (!parsed.success) {
        return { answer: "I still need valid contact and service details before I can submit this enquiry. Please provide your full name, email, phone and the requested service information.", provider: "openai" };
      }
      if (!parsed.data.consent) {
        return { answer: "Before I submit, please confirm that A.A.U Chamo may use these details to process and follow up your enquiry.", provider: "openai" };
      }

      const details = Object.fromEntries(Object.entries(parsed.data.details).filter((entry): entry is [string, string] => typeof entry[1] === "string" && Boolean(entry[1].trim())));
      const validated = enquiryInputSchema.safeParse({ ...parsed.data, details });
      if (!validated.success) {
        return { answer: "I still need valid contact information before I can submit this enquiry. Please check your full name, email and phone number.", provider: "openai" };
      }
      const missing = missingEnquiryDetails(validated.data.type, details);
      if (missing.length) {
        return { answer: `I still need: ${missing.join(", ")}. This remains an unconfirmed request until staff reviews it.`, provider: "openai" };
      }

      const { record, emailSent } = await submitEnquiry(validated.data);
      return {
        answer: `Your enquiry has been submitted for staff review. Reference: ${record.reference}. This is an acknowledgement, not a confirmed booking, price or transaction.${emailSent ? " An acknowledgement email has been sent." : " Please keep the reference for follow-up."}`,
        provider: "openai",
        enquiry: { reference: record.reference, status: record.status, emailSent },
      };
    }

    const answer = response.output_text.trim().slice(0, 1800);
    if (!answer || isUnsafeAnswer(answer)) return { answer: safetyReply, provider: "openai" };
    return { answer, provider: "openai" };
  } catch (error) {
    const requestId = error && typeof error === "object" && "request_id" in error ? String(error.request_id) : undefined;
    console.error("OpenAI assistant request failed", requestId ? { requestId } : error);
    return localAnswer(message);
  }
}
