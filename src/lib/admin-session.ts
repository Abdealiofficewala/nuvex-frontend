import { ADMIN_SESSION_KEY, ADMIN_USER_KEY } from "@/lib/constants";

function readPersistedItem(key: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const fromLocal = window.localStorage.getItem(key);
  if (fromLocal) {
    return fromLocal;
  }

  const fromSession = window.sessionStorage.getItem(key);
  if (!fromSession) {
    return null;
  }

  window.localStorage.setItem(key, fromSession);
  window.sessionStorage.removeItem(key);
  return fromSession;
}

function writePersistedItem(key: string, value: string): void {
  window.localStorage.setItem(key, value);
  window.sessionStorage.removeItem(key);
}

function removePersistedItem(key: string): void {
  window.localStorage.removeItem(key);
  window.sessionStorage.removeItem(key);
}

export function getAdminSession(): boolean {
  return readPersistedItem(ADMIN_SESSION_KEY) === "1";
}

export function getAdminUserEmail(): string | null {
  return readPersistedItem(ADMIN_USER_KEY);
}

export async function fetchAdminSessionFromCookie(): Promise<string | null> {
  try {
    const response = await fetch("/api/admin/auth/login", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as { data?: { email?: string } };
    const email = payload.data?.email?.trim();
    return email || null;
  } catch {
    return null;
  }
}

export async function syncAdminSessionCookie(email?: string): Promise<void> {
  if (!email?.trim()) {
    return;
  }

  await fetch("/api/admin/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email: email.trim() }),
  });
}

export async function clearAdminSessionCookie(): Promise<void> {
  await fetch("/api/admin/auth/login", {
    method: "DELETE",
    credentials: "include",
  });
}

export function setAdminSessionLocal(email?: string): void {
  writePersistedItem(ADMIN_SESSION_KEY, "1");

  if (email?.trim()) {
    writePersistedItem(ADMIN_USER_KEY, email.trim());
  }
}

export function setAdminSession(email?: string): void {
  setAdminSessionLocal(email);
  void syncAdminSessionCookie(email);
}

export function clearAdminSession(): void {
  removePersistedItem(ADMIN_SESSION_KEY);
  removePersistedItem(ADMIN_USER_KEY);
  void clearAdminSessionCookie();
}

export function getAdminDisplayName(email: string | null): string {
  if (!email) {
    return "Admin";
  }

  const local = email.split("@")[0] ?? "Admin";
  const parts = local.split(/[._-]+/).filter(Boolean);

  if (!parts.length) {
    return "Admin";
  }

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getAdminInitials(email: string | null): string {
  const name = getAdminDisplayName(email);

  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "A"
  );
}
