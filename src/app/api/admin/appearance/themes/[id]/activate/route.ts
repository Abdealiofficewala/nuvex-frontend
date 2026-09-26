import { requireAppearancePermission } from "@/lib/server/admin-auth";
import { activateTheme, getThemeById } from "@/lib/server/appearance-store";
import { handleApiError, jsonOk } from "@/lib/server/api-response";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  try {
    await requireAppearancePermission("activate");
    const { id } = await context.params;
    await activateTheme(id);
    const result = await getThemeById(id);
    return jsonOk(result);
  } catch (error) {
    return handleApiError(error);
  }
}
