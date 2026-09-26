import { requireAppearancePermission } from "@/lib/server/admin-auth";
import { createTheme, listThemes } from "@/lib/server/appearance-store";
import { handleApiError, jsonOk } from "@/lib/server/api-response";
import type { ThemeInput } from "@/types/appearance";

export async function GET() {
  try {
    await requireAppearancePermission("view");
    const themes = await listThemes();
    return jsonOk(themes);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAppearancePermission("create");
    const body = (await request.json()) as ThemeInput;
    const theme = await createTheme(body, session.email);
    return jsonOk(theme, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
