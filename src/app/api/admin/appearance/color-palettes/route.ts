import { requireAppearancePermission } from "@/lib/server/admin-auth";
import { createColorPalette, listColorPalettes } from "@/lib/server/appearance-store";
import { handleApiError, jsonOk } from "@/lib/server/api-response";
import type { ColorPaletteInput } from "@/types/appearance";

export async function GET() {
  try {
    await requireAppearancePermission("view");
    return jsonOk(await listColorPalettes());
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAppearancePermission("create");
    const body = (await request.json()) as ColorPaletteInput;
    return jsonOk(await createColorPalette(body), 201);
  } catch (error) {
    return handleApiError(error);
  }
}
