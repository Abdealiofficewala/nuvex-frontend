import { getActiveResolvedTheme } from "@/lib/server/appearance-store";
import { handleApiError, jsonOk } from "@/lib/server/api-response";

export async function GET() {
  try {
    const resolved = await getActiveResolvedTheme();
    return jsonOk(resolved);
  } catch (error) {
    return handleApiError(error);
  }
}
