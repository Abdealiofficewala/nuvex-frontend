import { requireAppearancePermission } from "@/lib/server/admin-auth";
import { deleteTheme, getThemeById, updateTheme } from "@/lib/server/appearance-store";
import { handleApiError, jsonOk } from "@/lib/server/api-response";
import type { ThemeInput } from "@/types/appearance";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireAppearancePermission("view");
    const { id } = await context.params;
    const result = await getThemeById(id);
    return jsonOk(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAppearancePermission("edit");
    const { id } = await context.params;
    const body = (await request.json()) as Partial<ThemeInput>;
    const theme = await updateTheme(id, body);
    return jsonOk(theme);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAppearancePermission("delete");
    const { id } = await context.params;
    await deleteTheme(id);
    return jsonOk({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
