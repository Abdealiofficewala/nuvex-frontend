import { NextRequest } from "next/server";
import { withAppearanceHandler } from "@/lib/server/appearance-api";
import { deleteColorPalette, updateColorPalette } from "@/lib/server/appearance-store";
import type { ColorPaletteInput } from "@/types/appearance";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  return withAppearanceHandler(request, "edit", async () => {
    const body = (await request.json()) as Partial<ColorPaletteInput>;
    return updateColorPalette(id, body);
  });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  return withAppearanceHandler(request, "delete", async () => {
    await deleteColorPalette(id);
    return { ok: true };
  });
}
