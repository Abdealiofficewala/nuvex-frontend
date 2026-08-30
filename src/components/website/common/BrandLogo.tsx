import Image from "next/image";
import { siteConfig } from "@/config/site.config";

type BrandLogoVariant = "default" | "light" | "dark" | "mobile";

type BrandLogoProps = {
  variant?: BrandLogoVariant;
  className?: string;
  height?: number;
};

const sources: Record<BrandLogoVariant, string> = {
  default: siteConfig.branding.logo,
  light: siteConfig.branding.logoLight,
  dark: siteConfig.branding.logoDark,
  mobile: siteConfig.branding.mobileLogo,
};

export function BrandLogo({ variant = "default", className, height }: BrandLogoProps) {
  const src = sources[variant];
  const isMark = variant === "mobile";
  const logoHeight = height ?? (isMark ? 36 : 36);

  if (!src) {
    return null;
  }

  return (
    <Image
      className={className}
      src={src}
      alt={siteConfig.company.name}
      width={isMark ? logoHeight : Math.round(logoHeight * 5.44)}
      height={logoHeight}
      style={{ width: "auto", height: logoHeight }}
      priority={variant === "default" || variant === "mobile"}
    />
  );
}
