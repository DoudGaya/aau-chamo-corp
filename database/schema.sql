CREATE TABLE IF NOT EXISTS website_enquiries (
  id BIGSERIAL PRIMARY KEY,
  reference VARCHAR(32) UNIQUE NOT NULL,
  type VARCHAR(40) NOT NULL,
  customer_name VARCHAR(160) NOT NULL,
  customer_email VARCHAR(254) NOT NULL,
  customer_phone VARCHAR(40) NOT NULL,
  message TEXT,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  status VARCHAR(40) NOT NULL DEFAULT 'New'
    CHECK (status IN ('New', 'In Review', 'Awaiting Customer', 'Confirmed', 'Completed', 'Cancelled')),
  department VARCHAR(80) NOT NULL,
  notification_state VARCHAR(40) NOT NULL DEFAULT 'Pending',
  notification_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS website_enquiries_email_reference_idx
  ON website_enquiries (LOWER(customer_email), reference);

CREATE INDEX IF NOT EXISTS website_enquiries_status_created_idx
  ON website_enquiries (status, created_at DESC);
