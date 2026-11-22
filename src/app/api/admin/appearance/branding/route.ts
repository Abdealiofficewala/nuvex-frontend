import { NextRequest } from "next/server";
import { withAppearanceHandler } from "@/lib/server/appearance-api";
import { createBranding, listBranding } from "@/lib/server/appearance-store";
import type { BrandingInput } from "@/types/appearance";

export async function GET(request: NextRequest) {
  return withAppearanceHandler(request, "view", () => listBranding());
}

export async function POST(request: NextRequest) {
  return withAppearanceHandler(request, "create", async () => {
    const body = (await request.json()) as BrandingInput;
    return createBranding(body);
  });
}
