import { requireAppearancePermission } from "@/lib/server/admin-auth";
import { createBranding, listBranding } from "@/lib/server/appearance-store";
import { handleApiError, jsonOk } from "@/lib/server/api-response";
import type { BrandingInput } from "@/types/appearance";

export async function GET() {
  try {
    await requireAppearancePermission("view");
    return jsonOk(await listBranding());
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAppearancePermission("create");
    const body = (await request.json()) as BrandingInput;
    return jsonOk(await createBranding(body), 201);
  } catch (error) {
    return handleApiError(error);
  }
}
