"use client";

import Script from "next/script";
import { AnalyticsPageView } from "@/components/analytics-page-view";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * PII RULE: Never pass name, email, phone, message, reference,
 * tracking number, or chat content to any analytics event.
 * Only structural/categorical values are permitted.
 */
export function track(
  event:
    | "cta_click"
    | "form_start"
    | "validation_error"
    | "enquiry_success"
    | "tracking_lookup"
    | "assistant_opened"
    | "assistant_handoff"
    | "assistant_submit_success"
    | "assistant_submit_error",
  params: Record<string, string | number | boolean> = {},
) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", event, params);
}

export function Analytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-2MN3L5S818";

  if (!measurementId || !/^G-[A-Z0-9]+$/i.test(measurementId)) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Analytics] NEXT_PUBLIC_GA_MEASUREMENT_ID is not set — analytics disabled in this environment.");
    }
    return null;
  }

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config',${JSON.stringify(measurementId)},{anonymize_ip:true,send_page_view:false});`}
      </Script>
      <AnalyticsPageView measurementId={measurementId} />
    </>
  );
}

