# A.A.U. Chamo Corporate Website — Technical Handover

**Prepared by:** Nillar Softwares  
**Handover date:** 29 September 2026  
**Recipient:** A.A.U. Chamo International Business Agency Services Limited

---

## 1. Repository

| Item | Detail |
|---|---|
| Repository | `aau-chamo-core` (monorepo) |
| Website path | `corporate-work/` |
| Main branch | `main` |
| Deployment branch | `main` (auto-deploy on Vercel) |
| Branch protection | Require PR review before merge to `main` |

---

## 2. Technology stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, React 19) |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL via Prisma ORM |
| CMS | Sanity v3 (embedded studio at `/studio`) |
| Email | Resend transactional email |
| AI assistant | OpenAI API (`gpt-4o-mini` default) |
| Deployment | Vercel (recommended) or any Node.js host |
| Package manager | npm |

---

## 3. Environment variables

All required and optional variables are documented in `.env.example`. Do not commit `.env` or `.env.local` to version control.

**Required for production (missing = deployment fails):**
- `DATABASE_URL` — PostgreSQL connection string
- `RESEND_API_KEY` — Resend API key for email
- `ENQUIRY_FROM_EMAIL` — Verified sender address
- `GENERAL_ENQUIRY_EMAIL` — Staff recipient for general enquiries
- `NEXT_PUBLIC_SITE_URL` — Canonical site URL (`https://www.aauchamo.com`)
- `ADMIN_API_SECRET` — Bearer secret for the staff admin API

**Optional (features gracefully disabled when absent):**
- `OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_MONTHLY_BUDGET_USD`
- `INVENTORY_TRACKING_API_URL`, `INVENTORY_API_TOKEN`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN`, `SANITY_WEBHOOK_SECRET`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `GOOGLE_SITE_VERIFICATION`
- `CARGO_ENQUIRY_EMAIL`, `TRAVEL_ENQUIRY_EMAIL`, `UMRAH_ENQUIRY_EMAIL`

---

## 4. Deployment steps

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Apply database migrations (ALWAYS back up the DB first)
npx prisma migrate deploy

# Build the application
npm run build

# Start the production server (if not using Vercel)
npm run start
```

**On Vercel:** Connect the repository. Set all environment variables in the Vercel project dashboard. Vercel will run `npm run build` (which includes `prisma generate`) automatically.

---

## 5. Database migrations

| Command | Purpose |
|---|---|
| `npx prisma migrate dev --name <name>` | Create a new migration in development |
| `npx prisma migrate deploy` | Apply pending migrations in production |
| `npx prisma migrate status` | Check migration state |
| `npx prisma studio` | Browse database (development only) |

**Critical:** Always take a PostgreSQL backup (`pg_dump`) before running `migrate deploy` in production.

**Pending migration to run after handover:**
```bash
npx prisma migrate dev --name add-audit-outbox-consent-idempotency
```
This creates the `enquiry_status_events` and `notification_outbox` tables and adds `source`, `consent_at`, `consent_version`, `idempotency_hash` columns to `website_enquiries`.

---

## 6. Rollback

**Application:** Use Vercel instant rollback to the previous deployment.

**Database:** If a migration causes issues:
```bash
npx prisma migrate resolve --rolled-back <migration-name>
```
Then manually revert the schema change in the database. Always restore from backup as the primary rollback strategy.

---

## 7. Staff admin API

Staff can query and update enquiries without database access using the admin API. All requests require:
```
Authorization: Bearer <ADMIN_API_SECRET>
```

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/admin/enquiries` | GET | List enquiries (supports `?status=&type=&limit=&offset=` query params) |
| `/api/admin/enquiries/{ref}/status` | PATCH | Update status (`{ "status": "In Review", "note": "optional" }`) |
| `/api/health` | GET | Health check incl. persistent notification failure count |

**Security:** Rotate `ADMIN_API_SECRET` immediately when any staff member with access leaves.

---

## 8. IMS (inventory tracking) integration contract

The tracking endpoint proxies to the IMS system when `INVENTORY_TRACKING_API_URL` is set. The IMS API must return:

```json
{
  "reference": "CARGO-12345",
  "status": "In Transit",
  "description": "Shipment in transit to destination airport.",
  "updatedAt": "2026-09-28T12:00:00Z"
}
```

Allowed `status` values: `Received`, `Processing`, `Dispatched`, `In Transit`, `Arrived`, `Ready for Collection`, `Delivered`. Any other value is filtered out.

**Current status:** Not connected. Tracking shows enquiry status only. Integration blocked until IMS owner provides sandbox credentials.

---

## 9. Provider ownership

| Provider | Account owner | Notes |
|---|---|---|
| Domain (`aauchamo.com`) | A.A.U. Chamo | Verify SPF/DKIM/DMARC for email deliverability |
| Hosting (Vercel) | A.A.U. Chamo | Transfer project ownership after handover |
| PostgreSQL database | A.A.U. Chamo | Managed PostgreSQL (Neon/Supabase/etc.) |
| Sanity CMS | A.A.U. Chamo | Configure editor roles in Sanity dashboard |
| OpenAI | A.A.U. Chamo | Set hard spend limit in dashboard |
| Resend email | A.A.U. Chamo | Verify domain and sender address |
| WhatsApp Business | A.A.U. Chamo | Confirm `NEXT_PUBLIC_WHATSAPP_NUMBER` is the official number |
| Google Analytics (GA4) | A.A.U. Chamo | Provide `NEXT_PUBLIC_GA_MEASUREMENT_ID` |
| Google Search Console | A.A.U. Chamo | Set `GOOGLE_SITE_VERIFICATION`; submit sitemap after go-live |

---

## 10. Known limitations

1. **In-memory rate limiting** resets on cold start. For high traffic, migrate to a Redis-backed rate limiter (e.g. Upstash).
2. **AI spend counter** resets on server restart. Set a hard limit in the OpenAI dashboard.
3. **No admin UI** — staff use the admin API or direct database for now. A web admin panel is deferred.
4. **Email retry** — failed emails are tracked in `notification_outbox` but not automatically retried. A cron job or manual re-trigger is needed for persistent failures.
5. **Management bios** on the About page are placeholders. Replace with approved content from A.A.U. Chamo management before launch.

---

## 11. Post-launch support

**Bug reports:** Contact Nillar Softwares with:
- Date and time of incident
- Page URL and action taken
- Error message (screenshot)
- Enquiry reference if applicable

**Emergency AI disable:** Set `OPENAI_API_KEY=` (empty) in Vercel environment variables and redeploy. The assistant will fall back to local knowledge immediately.

---

## 12. Final sign-off

| Role | Name | Signature | Date |
|---|---|---|---|
| Technical delivery | Nillar Softwares | | |
| Client acceptance | A.A.U. Chamo representative | | |
