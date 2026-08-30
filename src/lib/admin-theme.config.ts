import type { ThemeColors } from "@/types/theme";

export type AdminThemeLogoKey = "logo" | "logoLight" | "logoDark" | "mobileLogo" | "favicon";

export type AdminThemeColorKey = keyof ThemeColors;

export type AdminThemeColorGroup = "brand" | "surface" | "text";

export const ADMIN_THEME_LOGO_FIELDS: readonly {
  key: AdminThemeLogoKey;
  labelKey: `logos.${AdminThemeLogoKey}`;
  previewVariant?: "light" | "dark";
}[] = [
  { key: "logo", labelKey: "logos.logo" },
  { key: "logoLight", labelKey: "logos.logoLight", previewVariant: "dark" },
  { key: "logoDark", labelKey: "logos.logoDark", previewVariant: "light" },
  { key: "mobileLogo", labelKey: "logos.mobileLogo" },
  { key: "favicon", labelKey: "logos.favicon" },
] as const;

export const ADMIN_THEME_COLOR_GROUPS: readonly {
  group: AdminThemeColorGroup;
  labelKey: `colorGroups.${AdminThemeColorGroup}`;
  keys: readonly AdminThemeColorKey[];
}[] = [
  {
    group: "brand",
    labelKey: "colorGroups.brand",
    keys: ["primary", "primaryDark", "secondary", "accent"],
  },
  {
    group: "surface",
    labelKey: "colorGroups.surface",
    keys: ["background", "surface", "line"],
  },
  {
    group: "text",
    labelKey: "colorGroups.text",
    keys: ["text", "muted", "steel", "graphite"],
  },
] as const;

export const ADMIN_THEME_FONT_FIELDS = [
  { key: "heading", labelKey: "fonts.heading" },
  { key: "body", labelKey: "fonts.body" },
] as const;

export const ADMIN_THEME_RADIUS_FIELDS = [
  { key: "sm", labelKey: "radius.sm" },
  { key: "md", labelKey: "radius.md" },
  { key: "lg", labelKey: "radius.lg" },
] as const;

export type AdminThemeColorLabelKey = `colors.${AdminThemeColorKey}`;

export function getThemeColorLabelKey(key: AdminThemeColorKey): AdminThemeColorLabelKey {
  return `colors.${key}`;
}
