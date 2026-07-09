import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { MetadataRoute } from "next";

/** Colors come from the brand tokens in globals.css — the single source of
 *  color. The manifest route is static, so the file read happens at build
 *  time only. */
function brandToken(name: string): string {
  const css = readFileSync(
    join(process.cwd(), "src", "app", "globals.css"),
    "utf8",
  );
  const match = css.match(
    new RegExp(`--color-brand-${name}:\\s*(#[0-9a-fA-F]{6})`),
  );
  if (!match) throw new Error(`--color-brand-${name} not found in globals.css`);
  return match[1];
}

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "New Life Foundation",
    short_name: "New Life",
    start_url: "/",
    display: "standalone",
    theme_color: brandToken("green"),
    background_color: brandToken("cream"),
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
