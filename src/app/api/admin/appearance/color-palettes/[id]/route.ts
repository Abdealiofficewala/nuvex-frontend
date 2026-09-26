import { requireAppearancePermission } from "@/lib/server/admin-auth";
import {
  deleteColorPalette,
  getColorPaletteById,
  updateColorPalette,
} from "@/lib/server/appearance-store";
import { handleApiError, jsonOk } from "@/lib/server/api-response";
import type { ColorPaletteInput } from "@/types/appearance";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireAppearancePermission("view");
    const { id } = await context.params;
    return jsonOk(await getColorPaletteById(id));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAppearancePermission("edit");
    const { id } = await context.params;
    const body = (await request.json()) as Partial<ColorPaletteInput>;
    return jsonOk(await updateColorPalette(id, body));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAppearancePermission("delete");
    const { id } = await context.params;
    await deleteColorPalette(id);
    return jsonOk({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
