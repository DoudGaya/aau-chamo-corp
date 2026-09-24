import Script from "next/script";
import { AnalyticsPageView } from "@/components/analytics-page-view";

export function Analytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!measurementId || !/^G-[A-Z0-9]+$/i.test(measurementId)) return null;

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
