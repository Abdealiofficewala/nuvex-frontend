import { NextRequest } from "next/server";
import { withAppearanceHandler } from "@/lib/server/appearance-api";
import { listFonts } from "@/lib/server/appearance-store";

export async function GET(request: NextRequest) {
  return withAppearanceHandler(request, "view", () => listFonts());
}
