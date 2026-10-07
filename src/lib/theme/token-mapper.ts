import type { CSSProperties } from "react";
import type { AppearanceColorTokens } from "@/types/appearance";

/** Maps semantic design tokens to CSS custom properties (Tailwind 4 @theme). */
export function mapSemanticColorVars(colors: AppearanceColorTokens): CSSProperties {
  const foreground = colors.text;
  const mutedForeground = colors.muted;
  const border = colors.border || colors.line;
  const input = colors.surface;
  const ring = colors.primary;

  return {
    "--color-foreground": foreground,
    "--color-muted-foreground": mutedForeground,
    "--color-border": border,
    "--color-input": input,
    "--color-ring": ring,
    "--color-primary-foreground": "#ffffff",
    "--color-secondary-foreground": "#ffffff",
    "--color-accent-foreground": "#ffffff",
    "--color-danger": colors.error,
    "--color-warning": colors.warning,
    "--color-info": colors.info,
    "--color-success": colors.success,
    "--radius-button": "var(--admin-btn-radius, var(--radius-md))",
  } as CSSProperties;
}
