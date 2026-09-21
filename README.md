# A.A.U Chamo Corporate Website

Production-oriented corporate and customer-enquiry application for A.A.U Chamo International Business Agency Services Limited.

## Included in the first phase

- Responsive corporate website with distinct About, Services, Cargo, Flight & Travel, Umrah & Ziyarah, News, Gallery, Tracking, Contact and Enquiry routes.
- Nine dedicated service pages with benefits, process, FAQs, enquiry and WhatsApp actions.
- Structured service-specific enquiry forms, server-side validation, unique references and PostgreSQL persistence.
- Transactional acknowledgement and department-routing adapter using Resend-compatible email delivery.
- Guarded customer assistant with an approved local knowledge base and optional provider endpoint.
- Cargo-tracking adapter for the existing inventory system, with separate enquiry-status fallback.
- SEO metadata, Open Graph data, sitemap, robots policy, structured organisation data and optional Google Analytics.
- Security headers, request limits, honeypot spam control, payload limits and safe error responses.

The customer portal, payments, invoices, full admin dashboard, live flight issuance and complete inventory integration are intentionally future phases in the updated agreement.

## Local development

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`. In development only, enquiries use an in-memory store when `DATABASE_URL` is absent. Production refuses to accept an enquiry without durable database storage.

## Required production configuration

1. Create a PostgreSQL database and apply `database/schema.sql`.
2. Copy `.env.example` to the deployment environment and provide real values.
3. Configure official contact details and the WhatsApp Business number.
4. Configure Resend credentials and department email addresses.
5. Set the inventory tracking endpoint and token when the ERP API is approved.
6. Set the approved AI provider endpoint only if external AI is required; the controlled knowledge-base fallback works without it.
7. Add the Google Analytics measurement ID after consent and property setup.

## Quality gates

```bash
npm run typecheck
npm run lint
npm run build
```

## Documentation

- `docs/ARCHITECTURE.md` — application, data and integration design.
- `docs/DEPLOYMENT.md` — production setup, security and go-live checklist.
- `docs/STAFF-GUIDE.md` — enquiry, email, assistant and tracking operations.

## Safety contract

An enquiry is never presented as a confirmed booking or transaction. The assistant and public tracking layer do not invent prices, availability, delivery timelines, policies or confirmations. Only authorised staff or an approved connected system can confirm those facts.
