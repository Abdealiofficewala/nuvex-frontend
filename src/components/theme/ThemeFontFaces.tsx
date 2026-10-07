import { getAppearanceStore } from "@/lib/server/appearance-store";
import { getActiveTheme } from "@/lib/appearance/resolve-theme";

type ThemeFontFacesProps = {
  at?: Date;
};

export async function ThemeFontFaces({ at = new Date() }: ThemeFontFacesProps) {
  const store = await getAppearanceStore();
  const active = getActiveTheme(store, at);
  if (!active) {
    return null;
  }

  const preset = store.typographyPresets.find((item) => item.id === active.theme.typographyId);
  if (!preset) {
    return null;
  }

  const fontIds = new Set([preset.headingFontId, preset.bodyFontId]);
  const fonts = store.fonts.filter((font) => fontIds.has(font.id) && font.source === "custom");

  if (!fonts.length) {
    return null;
  }

  const rules = fonts
    .flatMap((font) =>
      Object.entries(font.files).map(
        ([weight, url]) =>
          `@font-face{font-family:${font.family};src:url("${url}") format("woff2");font-weight:${weight};font-style:${font.style};font-display:swap;}`,
      ),
    )
    .join("");

  return <style id="theme-font-faces">{rules}</style>;
}
