import { NextRequest } from "next/server";
import { withAppearanceHandler } from "@/lib/server/appearance-api";
import { deleteBranding, updateBranding } from "@/lib/server/appearance-store";
import type { BrandingInput } from "@/types/appearance";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  return withAppearanceHandler(request, "edit", async () => {
    const body = (await request.json()) as Partial<BrandingInput>;
    return updateBranding(id, body);
  });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  return withAppearanceHandler(request, "delete", async () => {
    await deleteBranding(id);
    return { ok: true };
  });
}
