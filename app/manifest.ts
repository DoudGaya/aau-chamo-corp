import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "A.A.U Chamo",
    short_name: "A.A.U Chamo",
    description: "Cargo, travel and international business services.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffdf9",
    theme_color: "#111214",
    icons: [{ src: "/aauchamo-logo.png", sizes: "889x281", type: "image/png" }],
  };
}
