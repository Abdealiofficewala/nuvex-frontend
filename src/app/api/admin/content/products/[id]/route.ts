import { requireContentPermission } from "@/lib/server/admin-auth";
import { deleteProduct, getProductById, updateProduct } from "@/lib/server/content-store";
import { handleApiError, jsonOk } from "@/lib/server/api-response";
import type { ProductInput } from "@/types/content-admin";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireContentPermission("view");
    const { id } = await context.params;
    return jsonOk(await getProductById(id));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireContentPermission("edit");
    const { id } = await context.params;
    const body = (await request.json()) as Partial<ProductInput>;
    return jsonOk(await updateProduct(id, body));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireContentPermission("delete");
    const { id } = await context.params;
    return jsonOk(await deleteProduct(id));
  } catch (error) {
    return handleApiError(error);
  }
}
