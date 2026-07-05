import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware drop-ins for Next.js navigation APIs — always use these
// instead of next/link and next/navigation for internal links.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
