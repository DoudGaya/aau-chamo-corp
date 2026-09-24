import { z } from "zod";

export const enquiryTypes = ["flight", "cargo", "courier", "umrah", "visa", "travel", "general"] as const;

export type EnquiryType = (typeof enquiryTypes)[number];

export const requiredDetails: Record<EnquiryType, string[]> = {
  flight: ["departure", "destination", "travelDate", "passengers"],
  cargo: ["sender", "receiver", "origin", "destination", "cargoType", "weight", "preferredDate", "deliveryOption"],
  courier: ["pickupLocation", "deliveryLocation", "preferredDate", "packageDetails"],
  umrah: ["travellers", "preferredDate", "packageInterest"],
  visa: ["country", "nationality", "travelPurpose", "travelDate"],
  travel: ["serviceType", "destination", "travelDate"],
  general: ["subject"],
};

export const enquiryInputSchema = z.object({
  type: z.enum(enquiryTypes),
  name: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(40).regex(/^[+\d\s().-]+$/),
  message: z.string().trim().max(2000).optional().default(""),
  details: z.record(z.string().max(60), z.string().trim().max(500)),
});

export function missingEnquiryDetails(type: EnquiryType, details: Record<string, string>) {
  return requiredDetails[type].filter((key) => !details[key]?.trim());
}
