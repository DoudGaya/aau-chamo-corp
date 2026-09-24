"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function AnalyticsPageView({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();

  useEffect(() => {
    window.gtag?.("config", measurementId, {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [measurementId, pathname]);

  return null;
}
