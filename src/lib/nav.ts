// Footer navigation — the full site map.
export const NAV_ITEMS = [
  { href: "/about", key: "about" },
  { href: "/how-we-work", key: "howWeWork" },
  { href: "/stories", key: "stories" },
  { href: "/how-to-help", key: "howToHelp" },
  { href: "/contact", key: "contact" },
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];

// Header navigation — a curated four. "needHelp" leads (the Request Help
// form); "routes" jumps to the homepage map section (#routes).
export const HEADER_NAV = [
  { href: "/contact", key: "needHelp" },
  { href: "/stories", key: "stories" },
  { href: "/how-we-work", key: "howWeWork" },
  { href: { pathname: "/", hash: "routes" }, key: "routes" },
] as const;

export type HeaderNavItem = (typeof HEADER_NAV)[number];
