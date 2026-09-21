import "server-only";

import { randomBytes } from "node:crypto";
import postgres from "postgres";

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

type GlobalStore = typeof globalThis & {
  __aauChamoSql?: ReturnType<typeof postgres>;
  __aauChamoEnquiries?: Map<string, EnquiryRecord>;
  __aauChamoSchemaReady?: Promise<void>;
};

const globalStore = globalThis as GlobalStore;

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return null;
  globalStore.__aauChamoSql ??= postgres(databaseUrl, {
    max: Number(process.env.DATABASE_POOL_SIZE || 5),
    idle_timeout: 20,
    connect_timeout: 12,
    ssl: process.env.DATABASE_SSL === "false" ? false : "require",
  });
  return globalStore.__aauChamoSql;
}

async function ensureSchema() {
  const sql = getSql();
  if (!sql) return;
  globalStore.__aauChamoSchemaReady ??= (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS website_enquiries (
        id BIGSERIAL PRIMARY KEY,
        reference VARCHAR(32) UNIQUE NOT NULL,
        type VARCHAR(40) NOT NULL,
        customer_name VARCHAR(160) NOT NULL,
        customer_email VARCHAR(254) NOT NULL,
        customer_phone VARCHAR(40) NOT NULL,
        message TEXT,
        details JSONB NOT NULL DEFAULT '{}'::jsonb,
        status VARCHAR(40) NOT NULL DEFAULT 'New',
        department VARCHAR(80) NOT NULL,
        notification_state VARCHAR(40) NOT NULL DEFAULT 'Pending',
        notification_error TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS website_enquiries_email_reference_idx ON website_enquiries (LOWER(customer_email), reference)`;
    await sql`CREATE INDEX IF NOT EXISTS website_enquiries_status_created_idx ON website_enquiries (status, created_at DESC)`;
  })();
  await globalStore.__aauChamoSchemaReady;
}

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
  const now = new Date().toISOString();
  const record: EnquiryRecord = { ...input, reference, status: "New", createdAt: now, updatedAt: now };
  const sql = getSql();

  if (!sql) {
    if (process.env.NODE_ENV === "production") throw new Error("Enquiry storage is not configured.");
    globalStore.__aauChamoEnquiries ??= new Map();
    globalStore.__aauChamoEnquiries.set(reference, record);
    return record;
  }

  await ensureSchema();
  await sql`
    INSERT INTO website_enquiries (
      reference, type, customer_name, customer_email, customer_phone,
      message, details, status, department
    ) VALUES (
      ${reference}, ${input.type}, ${input.name}, ${input.email.toLowerCase()}, ${input.phone},
      ${input.message || null}, ${sql.json(input.details)}, 'New', ${departmentFor(input.type)}
    )
  `;
  return record;
}

export async function getEnquiry(reference: string): Promise<EnquiryRecord | null> {
  const sql = getSql();
  if (!sql) return globalStore.__aauChamoEnquiries?.get(reference) || null;
  await ensureSchema();
  const rows = await sql<{
    reference: string; type: string; customer_name: string; customer_email: string;
    customer_phone: string; message: string | null; details: Record<string, string>;
    status: EnquiryStatus; created_at: Date; updated_at: Date;
  }[]>`
    SELECT reference, type, customer_name, customer_email, customer_phone,
      message, details, status, created_at, updated_at
    FROM website_enquiries WHERE reference = ${reference} LIMIT 1
  `;
  const row = rows[0];
  if (!row) return null;
  return {
    reference: row.reference,
    type: row.type,
    name: row.customer_name,
    email: row.customer_email,
    phone: row.customer_phone,
    message: row.message || undefined,
    details: row.details,
    status: row.status,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function updateNotification(reference: string, state: "Sent" | "Skipped" | "Failed", error?: string) {
  const sql = getSql();
  if (!sql) return;
  await ensureSchema();
  await sql`UPDATE website_enquiries SET notification_state = ${state}, notification_error = ${error || null}, updated_at = NOW() WHERE reference = ${reference}`;
}
