export const NAV_ITEMS = [
  { href: "/about", key: "about" },
  { href: "/how-we-work", key: "howWeWork" },
  { href: "/stories", key: "stories" },
  { href: "/how-to-help", key: "howToHelp" },
  { href: "/contact", key: "contact" },
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];
