import { NextRequest } from "next/server";
import { handleApiError, jsonOk } from "@/lib/server/api-response";
import { requireAppearancePermission } from "@/lib/server/admin-auth";

export async function withAppearanceHandler<T>(
  request: NextRequest,
  action: "view" | "create" | "edit" | "delete" | "activate",
  handler: () => Promise<T>,
) {
  try {
    await requireAppearancePermission(action);
    void request;
    return jsonOk(await handler());
  } catch (error) {
    return handleApiError(error);
  }
}
