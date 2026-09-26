import {
  createEmptyBrandingRecord,
  createEmptyColorTokens,
  DEFAULT_DESIGN,
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

export function resolveTheme(store: AppearanceStore, theme: ThemeRecord): ResolvedTheme {
  return {
    theme,
    branding: findBranding(store, theme.brandingId),
    colors: findColors(store, theme.colorPaletteId),
    typography: { ...SITE_TYPOGRAPHY },
    design: {
      ...DEFAULT_DESIGN,
      ...theme.design,
      spacing: { ...DEFAULT_DESIGN.spacing, ...theme.design?.spacing },
      radius: { ...DEFAULT_DESIGN.radius, ...theme.design?.radius },
      shadows: { ...DEFAULT_DESIGN.shadows, ...theme.design?.shadows },
      layout: { ...DEFAULT_DESIGN.layout, ...theme.design?.layout },
      sidebar: { ...DEFAULT_DESIGN.sidebar, ...theme.design?.sidebar },
      header: { ...DEFAULT_DESIGN.header, ...theme.design?.header },
      components: {
        ...DEFAULT_DESIGN.components,
        ...theme.design?.components,
        button: {
          ...DEFAULT_DESIGN.components.button,
          ...theme.design?.components?.button,
        },
        card: {
          ...DEFAULT_DESIGN.components.card,
          ...theme.design?.components?.card,
        },
        form: {
          ...DEFAULT_DESIGN.components.form,
          ...theme.design?.components?.form,
        },
        input: {
          ...DEFAULT_DESIGN.components.input,
          ...theme.design?.components?.input,
        },
        table: {
          ...DEFAULT_DESIGN.components.table,
          ...theme.design?.components?.table,
        },
        badge: {
          ...DEFAULT_DESIGN.components.badge,
          ...theme.design?.components?.badge,
        },
        alert: {
          ...DEFAULT_DESIGN.components.alert,
          ...theme.design?.components?.alert,
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
    brandingId: draft.brandingId ?? base?.brandingId ?? null,
    colorPaletteId: draft.colorPaletteId ?? base?.colorPaletteId ?? null,
    schedule: draft.schedule ?? base?.schedule ?? { ...DEFAULT_THEME_SCHEDULE },
    design: draft.design ?? base?.design ?? DEFAULT_DESIGN,
    createdBy: base?.createdBy ?? null,
    createdAt: base?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return resolveTheme(store, merged);
}
