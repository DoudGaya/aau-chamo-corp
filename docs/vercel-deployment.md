# Vercel Deployment Guide — A.A.U. Chamo Corporate Website

## 1. Project Configuration on Vercel

When importing the Git repository (`aau-chamo-core`) on Vercel:

| Setting | Value | Notes |
|---|---|---|
| **Framework Preset** | Next.js | Automatically detected |
| **Root Directory** | `corporate-work` | **Crucial:** The Next.js app is inside the `corporate-work` folder of the monorepo |
| **Build Command** | `npm run build` | Runs `prisma generate && next build` |
| **Output Directory** | `.next` | Default Next.js output |
| **Node.js Version** | `20.x` or `22.x` | Set under Project Settings > General |

---

## 2. Environment Variables Checklist

Add these in Vercel under **Project Settings > Environment Variables**:

### Production Required
- `DATABASE_URL` — Neon / PostgreSQL connection string with SSL (`sslmode=require`)
- `RESEND_API_KEY` — API key from [resend.com](https://resend.com)
- `ENQUIRY_FROM_EMAIL` — Verified sender address (e.g. `A.A.U Chamo <enquiries@aauchamo.com>`)
- `GENERAL_ENQUIRY_EMAIL` — Staff notification recipient (e.g. `aauchamo@gmail.com`)
- `CARGO_ENQUIRY_EMAIL` — Cargo notifications recipient
- `TRAVEL_ENQUIRY_EMAIL` — Travel notifications recipient
- `UMRAH_ENQUIRY_EMAIL` — Umrah notifications recipient
- `NEXT_PUBLIC_SITE_URL` — `https://www.aauchamo.com`
- `ADMIN_API_SECRET` — Long random string for authenticating `/api/admin/enquiries`

### Optional / Integration Variables
- `NEXT_PUBLIC_SANITY_PROJECT_ID` — Project ID from Sanity Manage
- `NEXT_PUBLIC_SANITY_DATASET` — `production`
- `SANITY_API_READ_TOKEN` — Viewer token for draft content
- `SANITY_WEBHOOK_SECRET` — Secret for on-demand ISR revalidation
- `OPENAI_API_KEY` — OpenAI API key for customer enquiry assistant
- `OPENAI_MODEL` — `gpt-4o-mini`
- `OPENAI_MONTHLY_BUDGET_USD` — Monthly spend ceiling (e.g. `20`)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — Google Analytics ID (e.g. `G-XXXXXXXXXX`)
- `NEXT_PUBLIC_WHATSAPP_NUMBER` — WhatsApp number format (e.g. `2349168340588`)

---

## 3. Database Deployment & Migrations

Before or right after your first deployment:
```bash
# In corporate-work directory
npx prisma migrate deploy
```
*Note: Always make sure database backups are active before running schema updates.*

---

## 4. Custom Domain & DNS Setup

In Vercel **Settings > Domains**, add:
1. `www.aauchamo.com` &rarr; CNAME pointing to `cname.vercel-dns.com`
2. `aauchamo.com` &rarr; Redirects to `www.aauchamo.com` with A record `76.76.21.21`

---

## 5. Post-Deployment Verification Checklist

1. **Homepage & Services:** Confirm pages load with HTTPS and security headers.
2. **Enquiry Submission:** Submit a test enquiry at `/contact` or `/services/*` and verify:
   - Database record is saved in Neon.
   - Confirmation email arrives from Resend.
   - Status tracking code functions at `/tracking`.
3. **Studio Access:** Visit `/studio` to verify Sanity Studio loads.
4. **Health Check:** `curl https://www.aauchamo.com/api/health` should return `{"status":"ok"}`.
