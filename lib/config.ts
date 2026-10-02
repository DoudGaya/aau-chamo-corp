/**
 * Startup configuration validator.
 * Call validateConfig() once at server start via instrumentation.ts.
 * In production, missing required vars throw immediately so the deployment
 * fails fast rather than serving a broken site.
 * In development, only warnings are emitted.
 */

const REQUIRED_PRODUCTION: [string, string][] = [
  ["DATABASE_URL", "PostgreSQL connection string for enquiry storage"],
  ["RESEND_API_KEY", "Resend API key for transactional email"],
  ["ENQUIRY_FROM_EMAIL", "Verified sender address for outbound email"],
  ["GENERAL_ENQUIRY_EMAIL", "Recipient address for general enquiries"],
  ["NEXT_PUBLIC_SITE_URL", "Canonical site URL for SEO and email links"],
  ["ADMIN_API_SECRET", "Bearer secret for the admin API endpoints"],
];

const OPTIONAL_FEATURES: [string, string][] = [
  ["OPENAI_API_KEY", "OpenAI key — assistant falls back to local knowledge without this"],
  ["OPENAI_MODEL", "OpenAI model name (e.g. gpt-4o-mini)"],
  ["INVENTORY_TRACKING_API_URL", "IMS tracking endpoint — tracking shows enquiry status only without this"],
  ["NEXT_PUBLIC_SANITY_PROJECT_ID", "Sanity project ID — CMS uses static fallback content without this"],
  ["NEXT_PUBLIC_WHATSAPP_NUMBER", "WhatsApp Business number — button links to /contact without this"],
  ["NEXT_PUBLIC_GA_MEASUREMENT_ID", "Google Analytics ID — analytics disabled without this"],
  ["CARGO_ENQUIRY_EMAIL", "Cargo & Operations department email (falls back to GENERAL_ENQUIRY_EMAIL)"],
  ["TRAVEL_ENQUIRY_EMAIL", "Travel Services department email (falls back to GENERAL_ENQUIRY_EMAIL)"],
  ["UMRAH_ENQUIRY_EMAIL", "Umrah Services department email (falls back to TRAVEL_ENQUIRY_EMAIL)"],
  ["GOOGLE_SITE_VERIFICATION", "Google Search Console verification token"],
];

export function validateConfig(): void {
  const isProd = process.env.NODE_ENV === "production";
  const missing: string[] = [];

  for (const [key, description] of REQUIRED_PRODUCTION) {
    if (!process.env[key]?.trim()) {
      if (isProd) {
        missing.push(`  ${key}: ${description}`);
      } else {
        console.warn(`[config] Missing required variable: ${key} — ${description}`);
      }
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `[config] The following required environment variables are not set:\n${missing.join("\n")}\n\nSet them in your environment or secret manager before deploying.`,
    );
  }

  for (const [key, description] of OPTIONAL_FEATURES) {
    if (!process.env[key]?.trim()) {
      console.warn(`[config] Optional feature disabled: ${key} — ${description}`);
    }
  }
}