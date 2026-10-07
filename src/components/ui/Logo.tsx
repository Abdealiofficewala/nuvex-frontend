"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useActiveThemeOptional } from "@/components/admin/appearance/ActiveThemeProvider";
import { siteConfig } from "@/config/site.config";
import { useThemeOptional } from "@/providers/ThemeProvider";
import { cn } from "@/lib/utils";

type LogoVariant = "primary" | "dark" | "light" | "mobile";

type LogoProps = {
  variant?: LogoVariant;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
};

type BrandingAssets = {
  logo: string;
  logoDark: string;
  logoLight: string;
  mobileLogo: string;
  brandName?: string;
  applicationName?: string;
};

const SITE_BRANDING: BrandingAssets = {
  logo: siteConfig.branding.logo,
  logoDark: siteConfig.branding.logoDark,
  logoLight: siteConfig.branding.logoLight,
  mobileLogo: siteConfig.branding.mobileLogo,
  brandName: siteConfig.company.shortName,
  applicationName: siteConfig.company.name,
};

function pickSrc(branding: BrandingAssets, variant: LogoVariant) {
  if (variant === "mobile") {
    return branding.mobileLogo || branding.logo;
  }

  if (variant === "dark") {
    return branding.logoDark || branding.logo;
  }

  if (variant === "light") {
    return branding.logoLight || branding.logo;
  }

  return branding.logo;
}

function useBrandingAssets(): BrandingAssets | null {
  const adminTheme = useActiveThemeOptional();
  const publicTheme = useThemeOptional();
  const resolved =
    adminTheme?.previewResolved ??
    adminTheme?.resolved ??
    publicTheme?.previewResolved ??
    publicTheme?.resolved;

  if (resolved?.branding) {
    return resolved.branding;
  }

  return SITE_BRANDING;
}

export function Logo({ variant = "primary", className, width = 140, height = 40, priority }: LogoProps) {
  const branding = useBrandingAssets();
  const src = useMemo(() => (branding ? pickSrc(branding, variant) : ""), [branding, variant]);

  if (!src) {
    return null;
  }

  const alt = branding?.brandName || branding?.applicationName || "Logo";

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn("ui-logo", className)}
      priority={priority}
      unoptimized
    />
  );
}
