import { computeThemeLifecycleStatus } from "@/lib/theme/status";
import type { Theme } from "@/config/theme/types";
import type { AppearanceStore, ResolvedTheme, ThemeRecord } from "@/types/appearance";

export function resolvedToTheme(resolved: ResolvedTheme, at: Date = new Date()): Theme {
  const { theme, branding, colors, typography, design } = resolved;

  return {
    id: theme.id,
    name: theme.name,
    slug: theme.slug,
    description: theme.description,
    branding: {
      applicationName: branding.applicationName,
      brandName: branding.brandName,
      logo: branding.logo,
      logoDark: branding.logoDark,
      logoLight: branding.logoLight,
      mobileLogo: branding.mobileLogo,
      favicon: branding.favicon,
    },
    colors,
    typography,
    shape: {
      borderRadius: design.radius.md,
      buttonRadius: design.components.button.radius,
      scale: design.radius,
    },
    appearance: {
      colorScheme: theme.appearance?.colorScheme ?? "light",
      allowUserThemeSwitch: false,
    },
    activation: {
      ...theme.schedule,
      status: computeThemeLifecycleStatus(theme, at),
      isFallback: theme.isFallback,
      disabled: theme.disabled,
    },
    updatedAt: theme.updatedAt,
  };
}

export function themeRecordFromStore(store: AppearanceStore, record: ThemeRecord, at?: Date): Theme {
  const resolved = {
    theme: record,
    branding: store.branding.find((b) => b.id === record.brandingId) ?? store.branding[0]!,
    colors:
      store.colorPalettes.find((p) => p.id === record.colorPaletteId)?.colors ??
      store.colorPalettes[0]!.colors,
    typography:
      store.typographyPresets.find((p) => p.id === record.typographyId)?.tokens ??
      store.typographyPresets[0]!.tokens,
    design: record.design,
  };

  return resolvedToTheme(resolved as ResolvedTheme, at);
}
