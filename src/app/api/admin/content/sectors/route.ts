import { requireContentPermission } from "@/lib/server/admin-auth";
import { createSector, listSectors } from "@/lib/server/content-store";
import { handleApiError, jsonOk } from "@/lib/server/api-response";
import type { SectorInput } from "@/types/content-admin";

export async function GET(request: Request) {
  try {
    await requireContentPermission("view");
    const { searchParams } = new URL(request.url);
    const industryId = searchParams.get("industryId") ?? undefined;

    return jsonOk(await listSectors({ industryId }));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireContentPermission("create");
    const body = (await request.json()) as SectorInput;
    return jsonOk(await createSector(body), 201);
  } catch (error) {
    return handleApiError(error);
  }
}
