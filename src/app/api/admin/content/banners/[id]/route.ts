import { requireContentPermission } from "@/lib/server/admin-auth";
import { deleteBanner, getBannerById, updateBanner } from "@/lib/server/content-store";
import { handleApiError, jsonOk } from "@/lib/server/api-response";
import type { BannerInput } from "@/types/content-admin";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireContentPermission("view");
    const { id } = await context.params;
    return jsonOk(await getBannerById(id));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireContentPermission("edit");
    const { id } = await context.params;
    const body = (await request.json()) as Partial<BannerInput>;
    return jsonOk(await updateBanner(id, body));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireContentPermission("delete");
    const { id } = await context.params;
    return jsonOk(await deleteBanner(id));
  } catch (error) {
    return handleApiError(error);
  }
}
