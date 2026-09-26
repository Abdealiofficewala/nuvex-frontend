import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, ADMIN_USER_COOKIE } from "@/lib/constants";
import { jsonError, jsonOk } from "@/lib/server/api-response";

type LoginBody = {
  email?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginBody;
    const email = body.email?.trim();

    if (!email) {
      return jsonError("Email is required", 422, "validation");
    }

    const response = jsonOk({ email });
    response.cookies.set(ADMIN_SESSION_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    response.cookies.set(ADMIN_USER_COOKIE, email, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });

    return response;
  } catch {
    return jsonError("Invalid request", 400);
  }
}

export async function DELETE() {
  const response = NextResponse.json({ data: { ok: true } });
  response.cookies.delete(ADMIN_SESSION_COOKIE);
  response.cookies.delete(ADMIN_USER_COOKIE);
  return response;
}
