import {
  createEmptyBrandingRecord,
  createEmptyColorTokens,
  DEFAULT_DESIGN,
  DEFAULT_THEME_APPEARANCE,
  DEFAULT_THEME_SCHEDULE,
  SITE_TYPOGRAPHY,
} from "@/lib/appearance/defaults";
import { resolveScheduledThemeRecord } from "@/lib/appearance/schedule";
import type {
  AppearanceStore,
  BrandingRecord,
  ColorPaletteRecord,
  ResolvedTheme,
  ThemeRecord,
} from "@/types/appearance";

function findBranding(store: AppearanceStore, id: string | null): BrandingRecord {
  const match = store.branding.find((item) => item.id === id);
  if (match) {
    return match;
  }

  const fallback = store.branding[0];
  if (fallback) {
    return fallback;
  }

  return createEmptyBrandingRecord(new Date().toISOString());
}

function findColors(store: AppearanceStore, id: string | null): ColorPaletteRecord["colors"] {
  const match = store.colorPalettes.find((item) => item.id === id);
  return match?.colors ?? store.colorPalettes[0]?.colors ?? createEmptyColorTokens();
}

function findTypography(store: AppearanceStore, id: string | null) {
  const match = store.typographyPresets.find((item) => item.id === id);
  return match?.tokens ?? store.typographyPresets[0]?.tokens ?? { ...SITE_TYPOGRAPHY };
}

export function resolveTheme(store: AppearanceStore, theme: ThemeRecord): ResolvedTheme {
  const normalizedTheme: ThemeRecord = {
    ...theme,
    appearance: theme.appearance ?? { ...DEFAULT_THEME_APPEARANCE },
    isFallback: theme.isFallback ?? false,
    disabled: theme.disabled ?? false,
    typographyId: theme.typographyId ?? store.typographyPresets[0]?.id ?? null,
  };

  return {
    theme: normalizedTheme,
    branding: findBranding(store, normalizedTheme.brandingId),
    colors: findColors(store, normalizedTheme.colorPaletteId),
    typography: findTypography(store, normalizedTheme.typographyId),
    design: {
      ...DEFAULT_DESIGN,
      ...normalizedTheme.design,
      spacing: { ...DEFAULT_DESIGN.spacing, ...normalizedTheme.design?.spacing },
      radius: { ...DEFAULT_DESIGN.radius, ...normalizedTheme.design?.radius },
      shadows: { ...DEFAULT_DESIGN.shadows, ...normalizedTheme.design?.shadows },
      layout: { ...DEFAULT_DESIGN.layout, ...normalizedTheme.design?.layout },
      sidebar: { ...DEFAULT_DESIGN.sidebar, ...normalizedTheme.design?.sidebar },
      header: { ...DEFAULT_DESIGN.header, ...normalizedTheme.design?.header },
      components: {
        ...DEFAULT_DESIGN.components,
        ...normalizedTheme.design?.components,
        button: {
          ...DEFAULT_DESIGN.components.button,
          ...normalizedTheme.design?.components?.button,
        },
        card: {
          ...DEFAULT_DESIGN.components.card,
          ...normalizedTheme.design?.components?.card,
        },
        form: {
          ...DEFAULT_DESIGN.components.form,
          ...normalizedTheme.design?.components?.form,
        },
        input: {
          ...DEFAULT_DESIGN.components.input,
          ...normalizedTheme.design?.components?.input,
        },
        table: {
          ...DEFAULT_DESIGN.components.table,
          ...normalizedTheme.design?.components?.table,
        },
        badge: {
          ...DEFAULT_DESIGN.components.badge,
          ...normalizedTheme.design?.components?.badge,
        },
        alert: {
          ...DEFAULT_DESIGN.components.alert,
          ...normalizedTheme.design?.components?.alert,
        },
      },
    },
  };
}

export function getActiveTheme(store: AppearanceStore, at: Date = new Date()): ResolvedTheme | null {
  const active = resolveScheduledThemeRecord(store.themes, at);
  return active ? resolveTheme(store, active) : null;
}

export function resolveThemeDraft(
  store: AppearanceStore,
  draft: Partial<ThemeRecord> & {
    brandingId?: string | null;
    colorPaletteId?: string | null;
    design?: ThemeRecord["design"];
  },
  fallbackTheme?: ThemeRecord,
): ResolvedTheme {
  const base = fallbackTheme ?? store.themes.find((item) => item.isActive) ?? store.themes[0];
  const merged: ThemeRecord = {
    id: draft.id ?? base?.id ?? "draft",
    name: draft.name ?? base?.name ?? "Draft theme",
    slug: draft.slug ?? base?.slug ?? "draft",
    description: draft.description ?? base?.description ?? "",
    isActive: false,
    isFallback: false,
    disabled: false,
    brandingId: draft.brandingId ?? base?.brandingId ?? null,
    colorPaletteId: draft.colorPaletteId ?? base?.colorPaletteId ?? null,
    typographyId: draft.typographyId ?? base?.typographyId ?? null,
    schedule: draft.schedule ?? base?.schedule ?? { ...DEFAULT_THEME_SCHEDULE },
    appearance: draft.appearance ?? base?.appearance ?? { ...DEFAULT_THEME_APPEARANCE },
    design: draft.design ?? base?.design ?? DEFAULT_DESIGN,
    createdBy: base?.createdBy ?? null,
    createdAt: base?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return resolveTheme(store, merged);
}
