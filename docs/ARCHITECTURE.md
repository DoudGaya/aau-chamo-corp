# Architecture

## Application structure

The project uses Next.js 16 App Router and React Server Components by default. Interactive boundaries are limited to navigation, forms, tracking and the customer assistant. Static company and service content is defined centrally in `lib/content.ts`, enabling a future CMS adapter without changing route design.

## Request flow

1. A customer submits a service-specific form to `POST /api/enquiries`.
2. Zod validates common contact data and the required detail fields for that service.
3. Spam controls check payload size, a honeypot and an instance-level request bucket.
4. The server creates a cryptographically random public reference and writes the request to PostgreSQL.
5. The email adapter sends customer acknowledgement and department notification when credentials are configured.
6. The response returns the reference and email-delivery state. It never returns a booking confirmation.

## Data model

`website_enquiries` stores the public reference, service type, customer contact data, JSON service details, workflow status, responsible department and notification result. Status values align to the agreement: New, In Review, Awaiting Customer, Confirmed, Completed and Cancelled.

Sensitive operational data remains in the ERP. The website exposes only customer-safe fields through the tracking adapter.

## Tracking integration

`GET /api/tracking/[reference]` calls the configured `INVENTORY_TRACKING_API_URL` using a server-side bearer token. Only the approved public status set is returned: Received, Processing, Dispatched, In Transit, Arrived, Ready for Collection and Delivered.

If live inventory integration is unavailable, the route can return a website enquiry's workflow status. The UI labels this as enquiry status, not live shipment tracking.

## Assistant safety

The assistant answers from the controlled service catalogue and intercepts requests for prices, availability, delivery guarantees and confirmations. An optional approved AI endpoint receives the same rules and knowledge base. Its response is rejected if it contains confirmation or currency claims.

## Security and resilience

- Secrets are server-only environment variables.
- Production enquiry submission requires durable PostgreSQL storage.
- Content Security Policy, clickjacking, MIME, referrer and permissions headers are configured globally.
- Public APIs validate length, shape and allowed status values.
- Email failure never destroys an accepted request; the failure state is retained for follow-up.
- Database backup, point-in-time recovery, external rate limiting and central error monitoring are deployment responsibilities.
