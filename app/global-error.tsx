"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html lang="en"><body><main className="page-hero" style={{ minHeight: "100vh", display: "grid", alignItems: "center" }}><div className="shell"><span className="eyebrow">Service interruption</span><h1 className="display">We could not load this page.</h1><p className="lede">Please retry. If the problem continues, contact A.A.U Chamo customer service.</p><button className="button red" type="button" onClick={reset}>Try again</button></div></main></body></html>;
}
