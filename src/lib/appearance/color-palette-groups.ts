import type { AppearanceColorTokens } from "@/types/appearance";

export const COLOR_PALETTE_GROUPS = [
  {
    id: "brand",
    keys: ["primary", "primaryDark", "secondary", "accent"],
  },
  {
    id: "surfaces",
    keys: ["background", "surface", "card", "text", "muted", "border"],
  },
  {
    id: "admin",
    keys: ["sidebar", "header"],
  },
  {
    id: "status",
    keys: ["success", "warning", "error", "info"],
  },
] as const;

export type ColorPaletteTokenKey = (typeof COLOR_PALETTE_GROUPS)[number]["keys"][number];

export const COLOR_PALETTE_TOKEN_KEYS: ColorPaletteTokenKey[] = COLOR_PALETTE_GROUPS.flatMap(
  (group) => [...group.keys],
);

export function isColorPaletteTokenKey(key: string): key is ColorPaletteTokenKey {
  return (COLOR_PALETTE_TOKEN_KEYS as readonly string[]).includes(key);
}

export type ColorPalettePreviewContext = Pick<
  AppearanceColorTokens,
  "background" | "surface" | "text" | "muted" | "border"
>;
