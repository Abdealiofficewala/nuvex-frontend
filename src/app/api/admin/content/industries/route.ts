import { requireContentPermission } from "@/lib/server/admin-auth";
import { createIndustry, listIndustries } from "@/lib/server/content-store";
import { handleApiError, jsonOk } from "@/lib/server/api-response";
import type { IndustryInput } from "@/types/content-admin";

export async function GET() {
  try {
    await requireContentPermission("view");
    return jsonOk(await listIndustries());
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireContentPermission("create");
    const body = (await request.json()) as IndustryInput;
    return jsonOk(await createIndustry(body), 201);
  } catch (error) {
    return handleApiError(error);
  }
}
