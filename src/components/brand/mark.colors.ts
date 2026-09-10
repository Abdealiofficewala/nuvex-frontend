import { HAKIMI_BRAND } from "@/config/brand.config";
import type { HakimiColorScheme, HakimiLogoMarkVariant } from "@/components/brand/types";

export function resolveWordmarkColors(
  variant: HakimiLogoMarkVariant = "duo",
  scheme: HakimiColorScheme = "light",
): { primary: string; secondary: string; rule: string } {
  const { colors } = HAKIMI_BRAND;

  if (variant === "white") {
    return { primary: colors.white, secondary: colors.gold, rule: colors.gold };
  }

  if (variant === "bronze") {
    return { primary: colors.gold, secondary: colors.gold, rule: colors.gold };
  }

  if (variant === "monochrome") {
    const tone = scheme === "dark" ? colors.beige : colors.charcoal;
    return { primary: tone, secondary: tone, rule: tone };
  }

  if (scheme === "dark") {
    return { primary: colors.beige, secondary: colors.gold, rule: colors.gold };
  }

  return { primary: colors.navy, secondary: colors.gold, rule: colors.gold };
}
