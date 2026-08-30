import { ADMIN_SESSION_KEY, ADMIN_USER_KEY } from "@/lib/constants";

export function getAdminSession(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
}

export function getAdminUserEmail(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage.getItem(ADMIN_USER_KEY);
}

export function setAdminSession(email?: string): void {
  window.sessionStorage.setItem(ADMIN_SESSION_KEY, "1");

  if (email?.trim()) {
    window.sessionStorage.setItem(ADMIN_USER_KEY, email.trim());
  }
}

export function clearAdminSession(): void {
  window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
  window.sessionStorage.removeItem(ADMIN_USER_KEY);
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
