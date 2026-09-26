import { listSectors } from "@/lib/server/content-store";
import { handleApiError, jsonOk } from "@/lib/server/api-response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const industryId = searchParams.get("industryId") ?? undefined;

    return jsonOk(await listSectors({ industryId, activeOnly: true }));
  } catch (error) {
    return handleApiError(error);
  }
}
