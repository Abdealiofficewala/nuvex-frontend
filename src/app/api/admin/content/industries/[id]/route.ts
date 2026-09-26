import { requireContentPermission } from "@/lib/server/admin-auth";
import { deleteIndustry, getIndustryById, updateIndustry } from "@/lib/server/content-store";
import { handleApiError, jsonOk } from "@/lib/server/api-response";
import type { IndustryInput } from "@/types/content-admin";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireContentPermission("view");
    const { id } = await context.params;
    return jsonOk(await getIndustryById(id));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireContentPermission("edit");
    const { id } = await context.params;
    const body = (await request.json()) as Partial<IndustryInput>;
    return jsonOk(await updateIndustry(id, body));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireContentPermission("delete");
    const { id } = await context.params;
    return jsonOk(await deleteIndustry(id));
  } catch (error) {
    return handleApiError(error);
  }
}
