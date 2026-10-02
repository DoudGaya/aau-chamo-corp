import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const alt = "A.A.U Chamo | Cargo, Aviation & Agency Services";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          background: "linear-gradient(135deg, #111214 0%, #1a1b1e 50%, #2b1111 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle decorative accent circle */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            right: "-150px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(229,38,30,0.25) 0%, rgba(229,38,30,0) 70%)",
          }}
        />

        {/* Top Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "10px",
                background: "#e5261e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: "24px",
                fontWeight: "900",
                letterSpacing: "-1px",
              }}
            >
              A
            </div>
            <span style={{ fontSize: "28px", fontWeight: "800", letterSpacing: "1px" }}>
              A.A.U CHAMO
            </span>
          </div>
          <span
            style={{
              fontSize: "14px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#e5261e",
              fontWeight: "700",
              border: "1px solid rgba(229,38,30,0.5)",
              padding: "8px 16px",
              borderRadius: "999px",
            }}
          >
            Nigeria &bull; Global
          </span>
        </div>

        {/* Main Pitch */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1
            style={{
              fontSize: "58px",
              fontWeight: "900",
              lineHeight: 1.1,
              letterSpacing: "-1px",
              margin: 0,
            }}
          >
            Cargo in Motion.
            <br />
            <span style={{ color: "#e5261e" }}>Travel Made Clear.</span>
          </h1>
          <p
            style={{
              fontSize: "22px",
              color: "#c0c0c0",
              maxWidth: "850px",
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            International Air &amp; Sea Cargo Logistics, Airline Flight Ticketing, Umrah &amp; Ziyarah Pilgrimage Packages, and Corporate Agency Services.
          </p>
        </div>

        {/* Bottom Bar Badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.15)",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", gap: "32px", fontSize: "16px", color: "#a0a0a0" }}>
            <span>&bull; Airport Cargo Hub (KAN)</span>
            <span>&bull; Verified Flight Booking</span>
            <span>&bull; Saudi Umrah Partner</span>
          </div>
          <span style={{ fontSize: "16px", color: "#ffffff", fontWeight: "600" }}>
            www.aauchamo.com
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
