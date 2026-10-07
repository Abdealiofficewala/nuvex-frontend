"use client";

import { HakimiLogo } from "@/components/brand/HakimiLogo";
import type { HakimiColorScheme, HakimiLogoLayout, HakimiLogoMarkVariant } from "@/components/brand/types";
import { Logo } from "@/components/ui/Logo";
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

function mapLogoVariant(variant: BrandLogoVariant): "primary" | "dark" | "light" | "mobile" {
  if (variant === "light") return "light";
  if (variant === "dark") return "dark";
  if (variant === "mobile" || variant === "compact") return "mobile";
  return "primary";
}

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
  const logoVariant = mapLogoVariant(variant);
  const width = variant === "compact" || variant === "mobile" ? logoHeight : Math.round(logoHeight * 3.5);

  return (
    <Logo
      variant={logoVariant}
      height={logoHeight}
      width={width}
      className={cn(
        "brand-logo",
        variant === "light" && "brand-logo--light",
        variant === "dark" && "brand-logo--dark",
        layout === "symbol-only" && "brand-logo--mark",
        layout === "stacked" && "brand-logo--stacked",
        className,
      )}
    />
  );
}

/** Vector mark fallback when CMS image assets are unavailable. */
export function BrandLogoMark({ variant = "default", layout, className, height }: BrandLogoProps) {
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
