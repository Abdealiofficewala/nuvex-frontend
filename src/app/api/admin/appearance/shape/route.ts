import { NextRequest } from "next/server";
import { withAppearanceHandler } from "@/lib/server/appearance-api";
import { updateDefaultThemeDesign } from "@/lib/server/appearance-store";
import type { ThemeDesignConfig } from "@/types/appearance";

export async function PATCH(request: NextRequest) {
  return withAppearanceHandler(request, "edit", async () => {
    const body = (await request.json()) as Partial<ThemeDesignConfig>;
    return updateDefaultThemeDesign(body);
  });
}
