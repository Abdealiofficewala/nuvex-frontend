import type { CSSProperties } from "react";
import { mockTheme } from "@/data/mock/theme";
import type { ThemeColors, ThemeTokens } from "@/types/theme";

type PartialTheme = {
  colors?: Partial<ThemeColors>;
  fonts?: Partial<ThemeTokens["fonts"]>;
  radius?: Partial<ThemeTokens["radius"]>;
};

export function normalizeTheme(data?: PartialTheme | null): ThemeTokens {
  return {
    colors: {
      ...mockTheme.colors,
      ...data?.colors,
    },
    fonts: {
      ...mockTheme.fonts,
      ...data?.fonts,
    },
    radius: {
      ...mockTheme.radius,
      ...data?.radius,
    },
  };
}

export function themeToCssVars(theme?: ThemeTokens | null): CSSProperties {
  const tokens = normalizeTheme(theme);

  return {
    "--color-primary": tokens.colors.primary,
    "--color-primary-dark": tokens.colors.primaryDark,
    "--color-secondary": tokens.colors.secondary,
    "--color-accent": tokens.colors.accent,
    "--color-background": tokens.colors.background,
    "--color-surface": tokens.colors.surface,
    "--color-text": tokens.colors.text,
    "--color-muted": tokens.colors.muted,
    "--color-steel": tokens.colors.steel,
    "--color-graphite": tokens.colors.graphite,
    "--color-line": tokens.colors.line,
    "--radius-sm": tokens.radius.sm,
    "--radius-md": tokens.radius.md,
    "--radius-lg": tokens.radius.lg,
  } as CSSProperties;
}
