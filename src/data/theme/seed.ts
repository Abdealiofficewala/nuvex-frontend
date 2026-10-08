import themeJson from "../../../theme.json";
import { siteConfig } from "@/config/site.config";
import {
  DEFAULT_DESIGN,
  DEFAULT_GLOBAL_APPEARANCE_SETTINGS,
  DEFAULT_THEME_APPEARANCE,
  DEFAULT_THEME_SCHEDULE,
  SITE_TYPOGRAPHY,
} from "@/lib/appearance/defaults";
import type { AppearanceStore } from "@/types/appearance";
import { FONT_LIBRARY } from "@/data/theme/fonts";

const NOW = "2026-01-01T00:00:00.000Z";

const BRANDING_ID = "brand-default";
const PALETTE_ID = "palette-default";
const TYPOGRAPHY_ID = "typography-default";
const THEME_DEFAULT_ID = "theme-default";

export function createSeedAppearanceStore(): AppearanceStore {
  const colors = siteConfig.theme.colors;

  return {
    fonts: [...FONT_LIBRARY],
    settings: { ...DEFAULT_GLOBAL_APPEARANCE_SETTINGS },
    branding: [
      {
        id: BRANDING_ID,
        name: "Default brand",
        slug: "default",
        logo: siteConfig.branding.logo,
        logoLight: siteConfig.branding.logoLight,
        logoDark: siteConfig.branding.logoDark,
        mobileLogo: siteConfig.branding.mobileLogo,
        favicon: siteConfig.branding.favicon,
        applicationName: siteConfig.company.name,
        brandName: siteConfig.company.name,
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
    colorPalettes: [
      {
        id: PALETTE_ID,
        name: "Hakimi default",
        slug: "hakimi-default",
        description: "Brand palette from theme.json",
        colors: {
          primary: colors.primary,
          primaryDark: colors.primaryDark,
          secondary: colors.secondary,
          accent: colors.accent,
          background: colors.background,
          surface: colors.surface,
          card: colors.surface,
          text: colors.text,
          muted: colors.muted,
          border: colors.line,
          sidebar: DEFAULT_DESIGN.sidebar.background,
          header: DEFAULT_DESIGN.header.background,
          success: "#067647",
          warning: "#B54708",
          error: "#B42318",
          info: "#175CD3",
          steel: colors.steel,
          graphite: colors.graphite,
          line: colors.line,
        },
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
    typographyPresets: [
      {
        id: TYPOGRAPHY_ID,
        name: "Default typography",
        slug: "default",
        headingFontId: "font-poppins",
        bodyFontId: "font-inter",
        tokens: {
          headingFont: `var(--font-heading), "${themeJson.typography.fonts.heading}", sans-serif`,
          bodyFont: `var(--font-body), "${themeJson.typography.fonts.body}", sans-serif`,
          baseFontSize: themeJson.typography.sizes.body,
          headingSizes: {
            h1: themeJson.typography.sizes.h1,
            h2: themeJson.typography.sizes.h2,
            h3: themeJson.typography.sizes.h3,
            h4: themeJson.typography.sizes.h4,
          },
          fontWeights: {
            heading: 600,
            body: 400,
            bold: 700,
          },
          lineHeights: {
            heading: themeJson.typography.lineHeight.heading,
            body: themeJson.typography.lineHeight.body,
          },
          letterSpacing: {
            tight: themeJson.typography.letterSpacing.tight,
            normal: "0",
            wide: themeJson.typography.letterSpacing.wide,
          },
        },
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
    themes: [
      {
        id: THEME_DEFAULT_ID,
        name: "Default theme",
        slug: "default",
        description: "Fallback theme for the public site and admin.",
        isActive: true,
        isFallback: true,
        disabled: false,
        brandingId: BRANDING_ID,
        colorPaletteId: PALETTE_ID,
        typographyId: TYPOGRAPHY_ID,
        schedule: { ...DEFAULT_THEME_SCHEDULE, mode: "always" },
        appearance: { ...DEFAULT_THEME_APPEARANCE },
        design: structuredClone(DEFAULT_DESIGN),
        createdBy: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
  };
}
