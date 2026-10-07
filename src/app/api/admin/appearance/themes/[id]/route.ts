import { NextRequest } from "next/server";
import { withAppearanceHandler } from "@/lib/server/appearance-api";
import { deleteTheme, getThemeById, updateTheme } from "@/lib/server/appearance-store";
import type { ThemeInput } from "@/types/appearance";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  return withAppearanceHandler(request, "view", () => getThemeById(id));
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  return withAppearanceHandler(request, "edit", async () => {
    const body = (await request.json()) as Partial<ThemeInput>;
    return updateTheme(id, body);
  });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  return withAppearanceHandler(request, "delete", async () => {
    await deleteTheme(id);
    return { ok: true };
  });
}
