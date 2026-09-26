import { listCategories } from "@/lib/server/content-store";
import { handleApiError, jsonOk } from "@/lib/server/api-response";

export async function GET() {
  try {
    return jsonOk(await listCategories({ visibleOnly: true }));
  } catch (error) {
    return handleApiError(error);
  }
}
