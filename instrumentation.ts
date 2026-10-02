/**
 * Next.js instrumentation hook — runs once on server startup.
 * See: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { validateConfig } = await import("@/lib/config");
    validateConfig();
  }
}