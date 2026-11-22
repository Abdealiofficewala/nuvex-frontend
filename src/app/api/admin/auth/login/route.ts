import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  ADMIN_USER_COOKIE,
} from "@/lib/constants";
import { jsonError, jsonOk } from "@/lib/server/api-response";

type LoginBody = {
  email?: string;
};

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
};

export async function GET() {
  const jar = await cookies();
  const session = jar.get(ADMIN_SESSION_COOKIE)?.value;
  const email = jar.get(ADMIN_USER_COOKIE)?.value?.trim();

  if (session !== "1" || !email) {
    return jsonError("Unauthorized", 401, "unauthorized");
  }

  return jsonOk({ email });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginBody;
    const email = body.email?.trim();

    if (!email) {
      return jsonError("Email is required", 422, "validation");
    }

    const response = jsonOk({ email });
    response.cookies.set(ADMIN_SESSION_COOKIE, "1", cookieOptions);
    response.cookies.set(ADMIN_USER_COOKIE, email, cookieOptions);

    return response;
  } catch {
    return jsonError("Invalid request", 400);
  }
}

export async function DELETE() {
  const response = NextResponse.json({ data: { ok: true } });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  response.cookies.set(ADMIN_USER_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  return response;
}
