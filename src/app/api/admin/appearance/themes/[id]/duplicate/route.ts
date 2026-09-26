import { requireAppearancePermission } from "@/lib/server/admin-auth";
import { duplicateTheme } from "@/lib/server/appearance-store";
import { handleApiError, jsonOk } from "@/lib/server/api-response";

type DuplicateThemeBody = {
  name?: string;
  slug?: string;
};

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const session = await requireAppearancePermission("create");
    const { id } = await context.params;
    const body = (await request.json().catch(() => ({}))) as DuplicateThemeBody;
    const theme = await duplicateTheme(id, session.email, {
      name: body.name,
      slug: body.slug,
    });
    return jsonOk(theme, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
