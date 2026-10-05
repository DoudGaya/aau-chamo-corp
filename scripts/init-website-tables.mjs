import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("No DATABASE_URL set.");
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await client.connect();
  console.log("Connected to PostgreSQL database:", client.host, client.database);

  const sql = `
    CREATE TABLE IF NOT EXISTS website_users (
      id VARCHAR(64) PRIMARY KEY,
      full_name VARCHAR(160) NOT NULL,
      email VARCHAR(254) UNIQUE NOT NULL,
      phone VARCHAR(40) NOT NULL,
      company_name VARCHAR(160),
      account_type VARCHAR(40) NOT NULL DEFAULT 'INDIVIDUAL',
      selected_services JSONB NOT NULL DEFAULT '[]'::jsonb,
      password_hash VARCHAR(255) NOT NULL,
      address TEXT,
      city VARCHAR(80),
      country VARCHAR(80) NOT NULL DEFAULT 'Nigeria',
      status VARCHAR(40) NOT NULL DEFAULT 'ACTIVE',
      notes TEXT,
      metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
      last_login_at TIMESTAMPTZ(6),
      created_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS website_users_email_idx ON website_users(email);
    CREATE INDEX IF NOT EXISTS website_users_status_created_idx ON website_users(status, created_at DESC);

    CREATE TABLE IF NOT EXISTS website_user_sessions (
      id VARCHAR(64) PRIMARY KEY,
      token VARCHAR(128) UNIQUE NOT NULL,
      user_id VARCHAR(64) NOT NULL REFERENCES website_users(id) ON DELETE CASCADE,
      expires_at TIMESTAMPTZ(6) NOT NULL,
      created_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS website_user_sessions_token_idx ON website_user_sessions(token);
    CREATE INDEX IF NOT EXISTS website_user_sessions_user_idx ON website_user_sessions(user_id);

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
      source VARCHAR(20) NOT NULL DEFAULT 'web',
      consent_version VARCHAR(10) NOT NULL DEFAULT 'v1',
      consent_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
      idempotency_hash VARCHAR(64) UNIQUE,
      notification_state VARCHAR(40) NOT NULL DEFAULT 'Pending',
      notification_error TEXT,
      user_id VARCHAR(64) REFERENCES website_users(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS website_enquiries_email_reference_idx ON website_enquiries(customer_email, reference);
    CREATE INDEX IF NOT EXISTS website_enquiries_status_created_idx ON website_enquiries(status, created_at DESC);
    CREATE INDEX IF NOT EXISTS website_enquiries_user_idx ON website_enquiries(user_id);

    CREATE TABLE IF NOT EXISTS enquiry_status_events (
      id BIGSERIAL PRIMARY KEY,
      enquiry_ref VARCHAR(32) NOT NULL REFERENCES website_enquiries(reference) ON DELETE CASCADE,
      old_status VARCHAR(40),
      new_status VARCHAR(40) NOT NULL,
      actor VARCHAR(80) NOT NULL,
      note TEXT,
      is_customer_visible BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS enquiry_status_events_ref_idx ON enquiry_status_events(enquiry_ref);

    CREATE TABLE IF NOT EXISTS notification_outbox (
      id BIGSERIAL PRIMARY KEY,
      enquiry_ref VARCHAR(32) NOT NULL,
      channel VARCHAR(20) NOT NULL,
      recipient VARCHAR(254) NOT NULL,
      template_id VARCHAR(40) NOT NULL,
      attempt_count INT NOT NULL DEFAULT 0,
      next_retry_at TIMESTAMPTZ(6),
      delivery_state VARCHAR(20) NOT NULL DEFAULT 'Pending',
      provider_msg_id VARCHAR(100),
      safe_error_code VARCHAR(20),
      created_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS notification_outbox_retry_idx ON notification_outbox(delivery_state, next_retry_at);
  `;

  await client.query(sql);
  console.log("Successfully created/verified website tables in the shared ERP database!");

  // List existing tables
  const res = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);
  console.log("Current tables in database:", res.rows.map(r => r.table_name).join(", "));

  await client.end();
}

main().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
