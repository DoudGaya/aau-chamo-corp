import Link from "next/link";

export default function NotFound() {
  return <section className="page-hero" style={{ minHeight: "70vh", display: "grid", alignItems: "center" }}><div className="shell"><span className="eyebrow">404</span><h1 className="display">That route is not on our board.</h1><p className="lede">Return home or start a service enquiry.</p><Link className="button red" href="/">Back to homepage</Link></div></section>;
}
