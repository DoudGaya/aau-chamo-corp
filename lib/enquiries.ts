import "server-only";

import { randomBytes } from "node:crypto";
import { prisma } from "./prisma";

export type EnquiryStatus = "New" | "In Review" | "Awaiting Customer" | "Confirmed" | "Completed" | "Cancelled";
export type EnquiryInput = {
  type: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  details: Record<string, string>;
};

export type EnquiryRecord = EnquiryInput & {
  reference: string;
  status: EnquiryStatus;
  createdAt: string;
  updatedAt: string;
};

function departmentFor(type: string) {
  if (["cargo", "courier"].includes(type)) return "Cargo & Operations";
  if (["flight", "visa", "travel", "umrah"].includes(type)) return "Travel Services";
  return "Customer Service";
}

function makeReference() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `AAU-${date}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export async function createEnquiry(input: EnquiryInput): Promise<EnquiryRecord> {
  const reference = makeReference();

  if (!process.env.DATABASE_URL) {
    if (process.env.NODE_ENV === "production") throw new Error("Enquiry storage is not configured.");
    const now = new Date().toISOString();
    return { ...input, reference, status: "New", createdAt: now, updatedAt: now };
  }

  const result = await prisma.websiteEnquiry.create({
    data: {
      reference,
      type: input.type,
      customerName: input.name,
      customerEmail: input.email.toLowerCase(),
      customerPhone: input.phone,
      message: input.message || null,
      details: input.details,
      status: "New",
      department: departmentFor(input.type),
    },
  });

  return {
    reference: result.reference,
    type: result.type,
    name: result.customerName,
    email: result.customerEmail,
    phone: result.customerPhone,
    message: result.message || undefined,
    details: result.details as Record<string, string>,
    status: result.status as EnquiryStatus,
    createdAt: result.createdAt.toISOString(),
    updatedAt: result.updatedAt.toISOString(),
  };
}

export async function getEnquiry(reference: string): Promise<EnquiryRecord | null> {
  if (!process.env.DATABASE_URL) return null;

  const result = await prisma.websiteEnquiry.findUnique({
    where: { reference },
  });

  if (!result) return null;

  return {
    reference: result.reference,
    type: result.type,
    name: result.customerName,
    email: result.customerEmail,
    phone: result.customerPhone,
    message: result.message || undefined,
    details: result.details as Record<string, string>,
    status: result.status as EnquiryStatus,
    createdAt: result.createdAt.toISOString(),
    updatedAt: result.updatedAt.toISOString(),
  };
}

export async function updateNotification(reference: string, state: "Sent" | "Skipped" | "Failed", error?: string) {
  if (!process.env.DATABASE_URL) return;

  await prisma.websiteEnquiry.update({
    where: { reference },
    data: {
      notificationState: state,
      notificationError: error || null,
      updatedAt: new Date(),
    },
  });
}
