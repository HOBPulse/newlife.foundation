import { Golos_Text, PT_Serif } from "next/font/google";
import localFont from "next/font/local";

// Body/UI face — sturdy humanist sans designed for Cyrillic screens
export const golos = Golos_Text({
  subsets: ["cyrillic", "latin"],
  variable: "--font-golos",
  display: "swap",
});

// Heading face — PT Serif (see the heading rules in globals.css). Preloaded:
// the hero h1 is the LCP element on the homepage.
export const ptSerif = PT_Serif({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "700"],
  variable: "--font-pt-serif",
  display: "swap",
});

// Numerals / wordmark / caps face — Fixel by MacPaw (OFL, see
// src/fonts/OFL-Fixel.txt), self-hosted. Exposed as --font-display; headings
// override it with PT Serif, so Fixel now carries tabular numerals, the
// wordmark and the footer caps only.
export const fixelDisplay = localFont({
  src: [
    { path: "../fonts/FixelDisplay-Light.woff2", weight: "300" },
    { path: "../fonts/FixelDisplay-Medium.woff2", weight: "500" },
    { path: "../fonts/FixelDisplay-SemiBold.woff2", weight: "600" },
  ],
  variable: "--font-fixel",
  display: "swap",
});
