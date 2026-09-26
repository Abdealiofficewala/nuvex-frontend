import { requireContentPermission } from "@/lib/server/admin-auth";
import { createProductType, listProductTypes } from "@/lib/server/content-store";
import { handleApiError, jsonOk } from "@/lib/server/api-response";
import type { ProductTypeInput } from "@/types/content-admin";

export async function GET(request: Request) {
  try {
    await requireContentPermission("view");
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("categorySlug") ?? undefined;
    return jsonOk(await listProductTypes(categorySlug ? { categorySlug } : undefined));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireContentPermission("create");
    const body = (await request.json()) as ProductTypeInput;
    return jsonOk(await createProductType(body), 201);
  } catch (error) {
    return handleApiError(error);
  }
}
