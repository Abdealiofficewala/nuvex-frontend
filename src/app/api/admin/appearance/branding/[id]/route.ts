import { requireAppearancePermission } from "@/lib/server/admin-auth";
import { deleteBranding, getBrandingById, updateBranding } from "@/lib/server/appearance-store";
import { handleApiError, jsonOk } from "@/lib/server/api-response";
import type { BrandingInput } from "@/types/appearance";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireAppearancePermission("view");
    const { id } = await context.params;
    return jsonOk(await getBrandingById(id));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAppearancePermission("edit");
    const { id } = await context.params;
    const body = (await request.json()) as Partial<BrandingInput>;
    return jsonOk(await updateBranding(id, body));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAppearancePermission("delete");
    const { id } = await context.params;
    await deleteBranding(id);
    return jsonOk({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
