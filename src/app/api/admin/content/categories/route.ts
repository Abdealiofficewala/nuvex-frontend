import { requireContentPermission } from "@/lib/server/admin-auth";
import { createCategory, listCategories } from "@/lib/server/content-store";
import { handleApiError, jsonOk } from "@/lib/server/api-response";
import type { CategoryInput } from "@/types/content-admin";

export async function GET() {
  try {
    await requireContentPermission("view");
    return jsonOk(await listCategories());
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireContentPermission("create");
    const body = (await request.json()) as CategoryInput;
    return jsonOk(await createCategory(body), 201);
  } catch (error) {
    return handleApiError(error);
  }
}
