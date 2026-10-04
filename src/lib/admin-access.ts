import {
  getDefaultPageAccess,
  getModulePermission,
  type AdminUserPageAccess,
} from "@/lib/admin-page-access.config";
import type { AdminAccessPageId } from "@/lib/admin-menu";
import { ADMIN_AUTH, ROUTES } from "@/lib/constants";
import {
  ensureAdminUserForEmail,
  getAdminUserByEmail,
  getAdminUserPageAccess,
  getEffectiveUserAccess,
  updateAdminUser,
} from "@/lib/admin-users";

export type AdminPageAction = "view" | "create" | "edit" | "delete";

const ACTION_PERMISSION_MAP: Record<AdminPageAction, "view" | "create" | "edit" | "delete"> = {
  view: "view",
  create: "create",
  edit: "edit",
  delete: "delete",
};

export function canAccessPage(
  access: AdminUserPageAccess,
  pageId: AdminAccessPageId,
  action: AdminPageAction,
): boolean {
  const permission = ACTION_PERMISSION_MAP[action];
  if (getModulePermission(access, pageId, permission)) {
    return true;
  }

  if (action === "view" && getModulePermission(access, pageId, "read")) {
    return true;
  }

  return false;
}

export function resolveAccessForEmail(email: string | null | undefined): AdminUserPageAccess {
  if (!email?.trim()) {
    return getDefaultPageAccess("none");
  }

  return getEffectiveUserAccess(email.trim().toLowerCase());
}

export function trackAdminLogin(email: string | null | undefined) {
  if (!email?.trim()) {
    return;
  }

  const normalized = email.trim().toLowerCase();
  const user = ensureAdminUserForEmail(normalized) ?? getAdminUserByEmail(normalized);
  if (!user) {
    return;
  }

  updateAdminUser(user.id, { lastLoginAt: new Date().toISOString() });
}

type RouteAccess = {
  pageId: AdminAccessPageId;
  action: AdminPageAction;
};

function matchesDynamicSegment(pathname: string, base: string, reserved: string[]) {
  if (!pathname.startsWith(`${base}/`)) {
    return null;
  }

  const suffix = pathname.slice(base.length + 1);
  if (!suffix || suffix.includes("/")) {
    return null;
  }

  if (reserved.includes(suffix)) {
    return null;
  }

  return suffix;
}

export function resolveAdminRouteAccess(pathname: string): RouteAccess | null {
  if (pathname === ROUTES.admin.dashboard) {
    return { pageId: "dashboard", action: "view" };
  }

  if (pathname === ROUTES.admin.users.root) {
    return { pageId: "users", action: "view" };
  }

  if (pathname === ROUTES.admin.users.create) {
    return { pageId: "users", action: "create" };
  }

  if (pathname === ROUTES.admin.users.profile || pathname === ROUTES.admin.users.profileEdit) {
    return {
      pageId: "usersProfile",
      action: pathname.endsWith("/edit") ? "edit" : "view",
    };
  }

  if (pathname === ROUTES.admin.users.roles) {
    return { pageId: "usersAccess", action: "view" };
  }

  if (pathname === ROUTES.admin.users.rolesCreate) {
    return { pageId: "usersAccess", action: "create" };
  }

  if (pathname.startsWith(`${ROUTES.admin.users.roles}/`)) {
    if (pathname.endsWith("/edit")) {
      return { pageId: "usersAccess", action: "edit" };
    }

    const suffix = pathname.slice(ROUTES.admin.users.roles.length + 1);
    if (suffix && !suffix.includes("/")) {
      return { pageId: "usersAccess", action: "view" };
    }
  }

  if (pathname.endsWith("/edit")) {
    const userId = matchesDynamicSegment(
      pathname.replace(/\/edit$/, ""),
      ROUTES.admin.users.root,
      ["create", "profile", "roles"],
    );
    if (userId) {
      return { pageId: "users", action: "edit" };
    }
  }

  const userId = matchesDynamicSegment(pathname, ROUTES.admin.users.root, [
    "create",
    "profile",
    "roles",
  ]);
  if (userId) {
    return { pageId: "users", action: "view" };
  }

  return null;
}

export function canAccessAdminRoute(
  pathname: string,
  email: string | null | undefined,
): boolean {
  const routeAccess = resolveAdminRouteAccess(pathname);
  if (!routeAccess) {
    return true;
  }

  const access = resolveAccessForEmail(email);

  if (
    !getAdminUserByEmail(email) &&
    email?.trim().toLowerCase() === ADMIN_AUTH.demoEmail.toLowerCase()
  ) {
    return true;
  }

  return canAccessPage(access, routeAccess.pageId, routeAccess.action);
}

export function getLegacyUserPageAccess(userId: string): AdminUserPageAccess {
  return getAdminUserPageAccess(userId);
}
