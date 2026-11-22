import { NextRequest } from "next/server";
import { withAppearanceHandler } from "@/lib/server/appearance-api";
import { getAppearanceStore, updateTypographyPreset } from "@/lib/server/appearance-store";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  return withAppearanceHandler(request, "view", async () => {
    const store = await getAppearanceStore();
    const preset = store.typographyPresets.find((item) => item.id === id);
    if (!preset) {
      throw new Error("not-found");
    }

    return preset;
  });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  return withAppearanceHandler(request, "edit", async () => {
    const body = await request.json();
    return updateTypographyPreset(id, body);
  });
}
