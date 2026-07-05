import { notFound } from "next/navigation";

// Catch-all: any unknown path under a valid locale renders the localized 404
export default function CatchAllPage() {
  notFound();
}
