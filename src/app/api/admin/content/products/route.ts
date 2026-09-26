import { requireContentPermission } from "@/lib/server/admin-auth";
import { createProduct, listProducts } from "@/lib/server/content-store";
import { handleApiError, jsonOk } from "@/lib/server/api-response";
import type { ProductInput } from "@/types/content-admin";

export async function GET() {
  try {
    await requireContentPermission("view");
    return jsonOk(await listProducts());
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireContentPermission("create");
    const body = (await request.json()) as ProductInput;
    return jsonOk(await createProduct(body), 201);
  } catch (error) {
    return handleApiError(error);
  }
}
