import "server-only";

import { createHash } from "node:crypto";
import { randomBytes } from "node:crypto";
import { prisma } from "./prisma";

export type EnquiryStatus = "New" | "In Review" | "Awaiting Customer" | "Confirmed" | "Completed" | "Cancelled";

/** All valid one-way status transitions. "Confirmed" can only be set by staff or system actors. */
const validTransitions: Record<EnquiryStatus, EnquiryStatus[]> = {
  New: ["In Review", "Cancelled"],
  "In Review": ["Awaiting Customer", "Confirmed", "Cancelled"],
  "Awaiting Customer": ["In Review", "Confirmed", "Cancelled"],
  Confirmed: ["Completed", "Cancelled"],
  Completed: [],
  Cancelled: [],
};

export type EnquiryInput = {
  type: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  details: Record<string, string>;
  source?: "web" | "assistant";
  consentVersion?: string;
  idempotencyToken?: string;
};

export type EnquiryRecord = {
  reference: string;
  type: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  details: Record<string, string>;
  status: EnquiryStatus;
  source: string;
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

function hashToken(token: string) {
  return createHash("sha256").update(`aau-idem:${token}`).digest("hex").slice(0, 64);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toRecord(result: any): EnquiryRecord {
  return {
    reference: result.reference,
    type: result.type,
    name: result.customerName,
    email: result.customerEmail,
    phone: result.customerPhone,
    message: result.message || undefined,
    details: result.details as Record<string, string>,
    status: result.status as EnquiryStatus,
    source: result.source || "web",
    createdAt: result.createdAt.toISOString(),
    updatedAt: result.updatedAt.toISOString(),
  };
}

// ─── Enquiry CRUD ────────────────────────────────────────────────────────────

export async function createEnquiry(input: EnquiryInput): Promise<{ record: EnquiryRecord; isDuplicate: boolean }> {
  const idempotencyHash = input.idempotencyToken ? hashToken(input.idempotencyToken) : undefined;

  if (!process.env.DATABASE_URL) {
    if (process.env.NODE_ENV === "production") throw new Error("Enquiry storage is not configured.");
    const now = new Date().toISOString();
    return {
      record: { ...input, reference: makeReference(), status: "New", source: input.source || "web", createdAt: now, updatedAt: now },
      isDuplicate: false,
    };
  }

  // Idempotency: if this token was already used, return the existing record without side-effects.
  if (idempotencyHash) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existing = await (prisma as any).websiteEnquiry.findUnique({ where: { idempotencyHash } });
    if (existing) return { record: toRecord(existing), isDuplicate: true };
  }

  const reference = makeReference();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await (prisma as any).websiteEnquiry.create({
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
      source: input.source || "web",
      consentVersion: input.consentVersion || "v1",
      consentAt: new Date(),
      idempotencyHash: idempotencyHash || null,
    },
  });

  // Write initial status event
  await appendStatusEvent(reference, null, "New", "system");

  return { record: toRecord(result), isDuplicate: false };
}

export async function getEnquiry(reference: string): Promise<EnquiryRecord | null> {
  if (!process.env.DATABASE_URL) return null;
  const result = await prisma.websiteEnquiry.findUnique({ where: { reference } });
  if (!result) return null;
  return toRecord(result);
}

export async function listEnquiries(options: {
  status?: string;
  type?: string;
  limit?: number;
  offset?: number;
}): Promise<EnquiryRecord[]> {
  if (!process.env.DATABASE_URL) return [];
  const { status, type, limit = 50, offset = 0 } = options;
  const results = await prisma.websiteEnquiry.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(type ? { type } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: Math.min(limit, 100),
    skip: offset,
  });
  return results.map(toRecord);
}

export async function updateEnquiryStatus(
  reference: string,
  newStatus: EnquiryStatus,
  actor: string,
  note?: string,
): Promise<EnquiryRecord> {
  if (!process.env.DATABASE_URL) throw new Error("Database not configured.");

  const existing = await prisma.websiteEnquiry.findUniqueOrThrow({ where: { reference } });
  const currentStatus = existing.status as EnquiryStatus;

  const allowed = validTransitions[currentStatus] || [];
  if (!allowed.includes(newStatus)) {
    throw new Error(`Transition from "${currentStatus}" to "${newStatus}" is not permitted.`);
  }

  // Only staff or system actors may confirm
  if (newStatus === "Confirmed" && !actor.startsWith("staff:") && actor !== "system") {
    throw new Error("Only an authorised staff member may confirm an enquiry.");
  }

  const result = await prisma.websiteEnquiry.update({
    where: { reference },
    data: { status: newStatus, updatedAt: new Date() },
  });

  await appendStatusEvent(reference, currentStatus, newStatus, actor, note);

  return toRecord(result);
}

// ─── Status Events ───────────────────────────────────────────────────────────

export async function appendStatusEvent(
  enquiryRef: string,
  oldStatus: EnquiryStatus | null,
  newStatus: EnquiryStatus | string,
  actor: string,
  note?: string,
  isCustomerVisible = false,
) {
  if (!process.env.DATABASE_URL) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (prisma as any).enquiryStatusEvent.create({
    data: { enquiryRef, oldStatus: oldStatus ?? null, newStatus, actor, note: note || null, isCustomerVisible },
  });
}

// ─── Notification Outbox ─────────────────────────────────────────────────────

export async function createOutboxEntries(
  enquiryRef: string,
  entries: Array<{ channel: string; recipient: string; templateId: string }>,
) {
  if (!process.env.DATABASE_URL) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (prisma as any).notificationOutbox.createMany({
    data: entries.map((e) => ({ ...e, enquiryRef, deliveryState: "Pending" })),
  });
}

export async function markOutboxSent(id: bigint, providerMsgId?: string) {
  if (!process.env.DATABASE_URL) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (prisma as any).notificationOutbox.update({
    where: { id },
    data: { deliveryState: "Sent", providerMsgId: providerMsgId || null, attemptCount: { increment: 1 }, updatedAt: new Date() },
  });
}

export async function markOutboxFailed(id: bigint, safeErrorCode: string) {
  if (!process.env.DATABASE_URL) return;
  const nextRetry = new Date(Date.now() + 5 * 60_000);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (prisma as any).notificationOutbox.update({
    where: { id },
    data: { deliveryState: "Failed", safeErrorCode, attemptCount: { increment: 1 }, nextRetryAt: nextRetry, updatedAt: new Date() },
  });
}

export async function countPersistentFailures(): Promise<number> {
  if (!process.env.DATABASE_URL) return 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (prisma as any).notificationOutbox.count({
    where: { deliveryState: "Failed", attemptCount: { gte: 3 } },
  });
}

// ─── Legacy notification state (kept for backwards compat) ───────────────────

export async function updateNotification(reference: string, state: "Sent" | "Skipped" | "Failed", error?: string) {
  if (!process.env.DATABASE_URL) return;
  await prisma.websiteEnquiry.update({
    where: { reference },
    data: { notificationState: state, notificationError: error || null, updatedAt: new Date() },
  });
}


