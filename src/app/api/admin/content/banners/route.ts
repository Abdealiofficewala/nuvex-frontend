import { requireContentPermission } from "@/lib/server/admin-auth";
import { createBanner, listBanners } from "@/lib/server/content-store";
import { handleApiError, jsonOk } from "@/lib/server/api-response";
import type { BannerInput } from "@/types/content-admin";

export async function GET() {
  try {
    await requireContentPermission("view");
    return jsonOk(await listBanners());
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireContentPermission("create");
    const body = (await request.json()) as BannerInput;
    return jsonOk(await createBanner(body), 201);
  } catch (error) {
    return handleApiError(error);
  }
}
