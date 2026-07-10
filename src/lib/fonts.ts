import { Golos_Text, PT_Serif } from "next/font/google";
import localFont from "next/font/local";

// Body/UI face — sturdy humanist sans designed for Cyrillic screens
export const golos = Golos_Text({
  subsets: ["cyrillic", "latin"],
  variable: "--font-golos",
  display: "swap",
});

// Hero font trial — only rendered behind ?font=serif (see HeroHeadline);
// preload off so the default page ships no extra font bytes
export const ptSerif = PT_Serif({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "700"],
  preload: false,
  display: "swap",
});

// Display face — Fixel by MacPaw (OFL, see src/fonts/OFL-Fixel.txt), self-hosted
export const fixelDisplay = localFont({
  src: [
    { path: "../fonts/FixelDisplay-Light.woff2", weight: "300" },
    { path: "../fonts/FixelDisplay-Medium.woff2", weight: "500" },
    { path: "../fonts/FixelDisplay-SemiBold.woff2", weight: "600" },
  ],
  variable: "--font-fixel",
  display: "swap",
});
