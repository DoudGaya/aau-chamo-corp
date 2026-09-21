export function GET() {
  return Response.json({
    ok: true,
    service: "aauchamo-corporate",
    integrations: {
      database: Boolean(process.env.DATABASE_URL),
      email: Boolean(process.env.RESEND_API_KEY && process.env.ENQUIRY_FROM_EMAIL),
      whatsapp: Boolean(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),
      inventory: Boolean(process.env.INVENTORY_TRACKING_API_URL),
      assistant: Boolean(process.env.AI_ASSISTANT_ENDPOINT),
      analytics: Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID),
    },
  });
}
