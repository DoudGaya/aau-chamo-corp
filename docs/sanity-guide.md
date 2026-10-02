# Sanity CMS Content Guide — A.A.U. Chamo Corporate Website

## 1. Accessing Sanity Studio

The content studio is embedded inside the Next.js application at:
- **Local:** `http://localhost:3000/studio`
- **Production:** `https://www.aauchamo.com/studio`

### Required Credentials
In `.env` (or Vercel Environment Variables):
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=optional_read_token_for_drafts
SANITY_WEBHOOK_SECRET=optional_revalidation_secret
```
*Create a project on [sanity.io/manage](https://www.sanity.io/manage) if you do not have one yet, then copy your Project ID.*

---

## 2. Content Schemas

The Studio manages 5 primary document types:

### 1. News Articles (`newsArticle`)
Published under `/news` and `/news/[slug]`.
- **Headline (`title`)**: Required. Main article title.
- **Slug (`slug`)**: URL slug generated from the headline (e.g. `clearer-digital-gateway`).
- **Publish Date (`publishedAt`)**: ISO datetime. Defaults to current time.
- **Featured Article (`featured`)**: Boolean toggle. When enabled, pins the article at the top with a highlight banner.
- **Category (`category`)**: Select from:
  - `Company News` (`company`)
  - `Industry Updates` (`industry`)
  - `Press Release` (`press`)
- **Short Excerpt (`excerpt`)**: Brief summary displayed on cards and search results.
- **Main Image (`mainImage`)**: Hero image with hotspot and crop tools.
- **Article Content (`body`)**: Rich text editor (headings, bold, links, lists, inline images).
- **SEO Config (`seo`)**: Meta title, meta description, and social share image.

### 2. Gallery Items (`galleryItem`)
Published on the `/gallery` page.
- **Title (`title`)**: Required image title.
- **Category (`category`)**: Filter category for the gallery:
  - `Airport & cargo operations`
  - `Training activities`
  - `International business events`
  - `Umrah & Ziyarah activities`
  - `Staff & customer service`
  - `Office locations`
- **Caption (`caption`)**: Optional description beneath the image.
- **Image (`image`)**: Required image upload with hotspot cropping.
- **Date of Occurrence (`occurredAt`)**: Optional date when the photo was taken.
- **Display Order (`order`)**: Numeric sorting order.

### 3. Staff Members (`staffMember`)
For the About / Leadership roster.
- **Full Name (`name`)**: Required.
- **Corporate Position / Role (`role`)**: Required (e.g. "Managing Director", "Head of Cargo").
- **Department (`department`)**: Executive / Board, Cargo & Logistics, Aviation & Travel, Umrah & Ziyarah, Customer Service.
- **Biography (`bio`)**: Professional background summary.
- **Portrait Image (`portrait`)**: Staff photograph.
- **Display Order (`hierarchyOrder`)**: Lower numbers appear first (e.g., 1 for CEO/MD).
- **Public Email & LinkedIn URL**: Optional contact links.

### 4. Events (`event`)
For upcoming corporate and community events.
- **Event Name (`title`)** and **Slug (`slug`)**.
- **Date & Time (`dateRange`)**: Start date/time and optional end date/time.
- **Location (`location`)**: Physical venue or "Virtual".
- **Cover Image (`coverImage`)**.
- **Event Details (`description`)**: Rich text.
- **Registration Link (`registrationLink`)**: Optional external URL for tickets/registration.

### 5. Tip / Blog Posts (`post`)
Knowledge base and shipping/travel guides.
- **Title**, **Slug**, **Type** (`Quick Tip` or `Full Guide`).
- **Author**: Reference link to a `staffMember` document.
- **Cover Image**, **Content**, and **SEO Config**.

---

## 3. Fallback Content Behavior

If Sanity is not connected or `NEXT_PUBLIC_SANITY_PROJECT_ID` is empty:
- `/news` automatically renders default static news items from `lib/content.ts`.
- `/gallery` automatically displays default categorized placeholder sections.
- The site remains completely functional and will never crash if the CMS is offline.
