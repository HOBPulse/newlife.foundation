import Image from "next/image";

type Props = { className?: string };

/**
 * Twemoji 💗 "growing heart" (U+1F497), vendored at public/brand/heart-1f497.svg
 * (source: github.com/twitter/twemoji, graphics CC-BY 4.0). Rendered via
 * next/image so its built-in pink fills are preserved — deliberately NOT
 * recolored to currentColor. Header «Підтримати» button only.
 */
export function HeartIcon({ className }: Props) {
  return (
    <Image
      src="/brand/heart-1f497.svg"
      alt=""
      width={16}
      height={16}
      className={className}
    />
  );
}
