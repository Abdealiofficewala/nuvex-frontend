import { NextRequest } from "next/server";
import { withAppearanceHandler } from "@/lib/server/appearance-api";
import { getAppearanceSettings, updateAppearanceSettings } from "@/lib/server/appearance-store";
import type { GlobalAppearanceSettings } from "@/types/appearance";

export async function GET(request: NextRequest) {
  return withAppearanceHandler(request, "view", () => getAppearanceSettings());
}

export async function PATCH(request: NextRequest) {
  return withAppearanceHandler(request, "edit", async () => {
    const body = (await request.json()) as Partial<GlobalAppearanceSettings>;
    return updateAppearanceSettings(body);
  });
}
