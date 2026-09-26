import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, ADMIN_USER_COOKIE } from "@/lib/constants";

export type AdminSession = {
  email: string;
};

export async function getAdminSession(): Promise<AdminSession | null> {
  const jar = await cookies();
  const session = jar.get(ADMIN_SESSION_COOKIE)?.value;
  const email = jar.get(ADMIN_USER_COOKIE)?.value?.trim();

  if (session !== "1" || !email) {
    return null;
  }

  return { email };
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("unauthorized");
  }

  return session;
}

export type AppearanceAction = "view" | "create" | "edit" | "delete" | "activate";
export type ContentAction = "view" | "create" | "edit" | "delete";

export async function requireAppearancePermission(action: AppearanceAction): Promise<AdminSession> {
  void action;
  return requireAdminSession();
}

export async function requireContentPermission(action: ContentAction): Promise<AdminSession> {
  void action;
  return requireAdminSession();
}
