import { HakimiLogo } from "@/components/brand/HakimiLogo";
import type { HakimiColorScheme, HakimiLogoLayout, HakimiLogoMarkVariant } from "@/components/brand/types";
import { cn } from "@/lib/utils";

type BrandLogoVariant = "default" | "light" | "dark" | "compact" | "mobile";

type BrandLogoProps = {
  variant?: BrandLogoVariant;
  layout?: HakimiLogoLayout;
  className?: string;
  height?: number;
};

const DEFAULT_HEIGHT: Record<BrandLogoVariant, number> = {
  default: 36,
  light: 34,
  dark: 34,
  compact: 30,
  mobile: 30,
};

function resolveBrandTone(variant: BrandLogoVariant): {
  mark: HakimiLogoMarkVariant;
  scheme: HakimiColorScheme;
} {
  if (variant === "light" || variant === "mobile") {
    return { mark: "duo", scheme: "dark" };
  }

  if (variant === "dark") {
    return { mark: "monochrome", scheme: "light" };
  }

  return { mark: "duo", scheme: "light" };
}

export function BrandLogo({ variant = "default", layout, className, height }: BrandLogoProps) {
  const logoHeight = height ?? DEFAULT_HEIGHT[variant];
  const tone = resolveBrandTone(variant);
  const resolvedLayout = layout ?? (variant === "mobile" ? "symbol-only" : "horizontal");

  return (
    <HakimiLogo
      layout={resolvedLayout}
      variant={tone.mark}
      scheme={tone.scheme}
      size={logoHeight}
      compact={variant === "compact"}
      className={cn(
        "brand-logo",
        variant === "light" && "brand-logo--light",
        variant === "dark" && "brand-logo--dark",
        resolvedLayout === "symbol-only" && "brand-logo--mark",
        resolvedLayout === "stacked" && "brand-logo--stacked",
        className,
      )}
    />
  );
}
