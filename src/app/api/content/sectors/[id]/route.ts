import { getSectorById } from "@/lib/server/content-store";
import { handleApiError, jsonOk } from "@/lib/server/api-response";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    return jsonOk(await getSectorById(id));
  } catch (error) {
    return handleApiError(error);
  }
}
