import { requireContentPermission } from "@/lib/server/admin-auth";
import {
  deleteProductType,
  getProductTypeById,
  updateProductType,
} from "@/lib/server/content-store";
import { handleApiError, jsonOk } from "@/lib/server/api-response";
import type { ProductTypeInput } from "@/types/content-admin";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireContentPermission("view");
    const { id } = await context.params;
    return jsonOk(await getProductTypeById(id));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireContentPermission("edit");
    const { id } = await context.params;
    const body = (await request.json()) as Partial<ProductTypeInput>;
    return jsonOk(await updateProductType(id, body));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireContentPermission("delete");
    const { id } = await context.params;
    return jsonOk(await deleteProductType(id));
  } catch (error) {
    return handleApiError(error);
  }
}
