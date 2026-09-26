import { listProductTypes } from "@/lib/server/content-store";
import { handleApiError, jsonOk } from "@/lib/server/api-response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("categorySlug") ?? undefined;
    return jsonOk(
      await listProductTypes({
        categorySlug,
        visibleOnly: true,
      }),
    );
  } catch (error) {
    return handleApiError(error);
  }
}
