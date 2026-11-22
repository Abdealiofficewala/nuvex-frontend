import { NextRequest } from "next/server";
import { withAppearanceHandler } from "@/lib/server/appearance-api";
import { duplicateTheme } from "@/lib/server/appearance-store";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  return withAppearanceHandler(request, "create", async () => {
    const body = (await request.json().catch(() => ({}))) as { name?: string; slug?: string };
    return duplicateTheme(id, null, body);
  });
}
