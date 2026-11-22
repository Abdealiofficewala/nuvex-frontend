import { NextRequest } from "next/server";
import { withAppearanceHandler } from "@/lib/server/appearance-api";
import { createTheme, listThemes } from "@/lib/server/appearance-store";
import type { ThemeInput } from "@/types/appearance";

export async function GET(request: NextRequest) {
  return withAppearanceHandler(request, "view", () => listThemes());
}

export async function POST(request: NextRequest) {
  return withAppearanceHandler(request, "create", async () => {
    const body = (await request.json()) as ThemeInput;
    return createTheme(body);
  });
}
