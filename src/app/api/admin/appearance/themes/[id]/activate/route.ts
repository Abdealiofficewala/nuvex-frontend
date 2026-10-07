import { NextRequest } from "next/server";
import { resolveTheme } from "@/lib/appearance/resolve-theme";
import { withAppearanceHandler } from "@/lib/server/appearance-api";
import { activateTheme, getAppearanceStore } from "@/lib/server/appearance-store";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  return withAppearanceHandler(request, "activate", async () => {
    const theme = await activateTheme(id);
    const store = await getAppearanceStore();

    return {
      theme,
      resolved: resolveTheme(store, theme),
    };
  });
}
