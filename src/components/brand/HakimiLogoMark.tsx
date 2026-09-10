import { HAKIMI_BRAND } from "@/config/brand.config";
import type { HakimiLogoMarkProps } from "@/components/brand/types";
import { cn } from "@/lib/utils";

export function HakimiLogoMark({
  size = 48,
  className,
  decorative = false,
}: HakimiLogoMarkProps) {
  const label = HAKIMI_BRAND.ariaLabel;
  const { mark, markWidth, markHeight } = HAKIMI_BRAND.assets;
  const src = mark;
  const height = size;
  const width = Math.round((size * markWidth) / markHeight);

  return (
    <img
      src={src}
      alt={decorative ? "" : label}
      width={width}
      height={height}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      draggable={false}
      className={cn("block shrink-0 object-contain", className)}
    />
  );
}
