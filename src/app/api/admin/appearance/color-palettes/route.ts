import { NextRequest } from "next/server";
import { withAppearanceHandler } from "@/lib/server/appearance-api";
import { createColorPalette, listColorPalettes } from "@/lib/server/appearance-store";
import type { ColorPaletteInput } from "@/types/appearance";

export async function GET(request: NextRequest) {
  return withAppearanceHandler(request, "view", () => listColorPalettes());
}

export async function POST(request: NextRequest) {
  return withAppearanceHandler(request, "create", async () => {
    const body = (await request.json()) as ColorPaletteInput;
    return createColorPalette(body);
  });
}
