# Deployment and Go-Live

## Recommended platform

Deploy to Vercel, AWS or another managed Node.js platform with PostgreSQL, HTTPS, environment-secret management and central logs. Do not deploy as a static export because enquiries, assistant requests and tracking use server routes.

## Pre-deployment

1. Provision PostgreSQL with encrypted connections and backups.
2. Apply `database/schema.sql` with a restricted migration account.
3. Configure all required values from `.env.example` in the hosting secret store.
4. Replace fallback contact information with the approved head-office address, telephone, WhatsApp number and email.
5. Verify department email routing with test submissions for every form type.
6. Configure the ERP tracking URL only after its authentication and customer-safe response contract are approved.
7. Configure analytics and Search Console ownership for the production domain.

## Go-live checks

- `npm run check` passes on the deployment commit.
- `/api/health` reports database, email, WhatsApp and analytics as configured.
- HTTPS is active and HTTP redirects to HTTPS.
- Forms return a reference and write a matching database record.
- Customer and department emails arrive with the correct reference.
- WhatsApp actions open the official business number with a pre-filled message.
- Assistant tests reject price, availability and confirmation questions.
- Tracking exposes only the seven approved customer statuses.
- Mobile navigation, keyboard navigation, form labels and focus states work.
- Sitemap and robots endpoints return the production host.

## Operations

- Retain database backups according to company policy and test restoration quarterly.
- Add managed rate limiting and bot protection at the edge for production traffic.
- Connect platform logs to an error-monitoring service and set alerts for 5xx responses.
- Review enquiry access and retention quarterly.
- Rotate API and email credentials at least annually and after any suspected exposure.
