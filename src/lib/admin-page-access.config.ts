import {
  ADMIN_ACCESS_MENU_MODULES,
  ADMIN_ACCESS_PAGES,
  type AdminAccessMenuModuleId,
  type AdminAccessPageId,
} from "@/lib/admin-menu";

export const ADMIN_PAGE_PERMISSIONS = ["view", "read", "create", "edit", "delete", "write"] as const;

export type AdminPagePermission = (typeof ADMIN_PAGE_PERMISSIONS)[number];

export type AdminModulePermissions = Partial<Record<AdminPagePermission, boolean>>;

export type AdminUserPageAccess = Partial<Record<AdminAccessPageId, AdminModulePermissions>>;

export type AdminPageAccessMap = Record<string, AdminUserPageAccess>;

export function emptyModulePermissions(): AdminModulePermissions {
  return Object.fromEntries(ADMIN_PAGE_PERMISSIONS.map((permission) => [permission, false])) as AdminModulePermissions;
}

export function getDefaultModulePermissions(
  preset: "none" | "read" | "full" = "read",
): AdminModulePermissions {
  if (preset === "none") {
    return emptyModulePermissions();
  }

  if (preset === "full") {
    return Object.fromEntries(ADMIN_PAGE_PERMISSIONS.map((permission) => [permission, true])) as AdminModulePermissions;
  }

  return {
    view: true,
    read: true,
    create: false,
    edit: false,
    delete: false,
    write: false,
  };
}

export function getDefaultPageAccess(
  preset: "none" | "read" | "full" = "read",
): AdminUserPageAccess {
  const modulePermissions = getDefaultModulePermissions(preset);

  return Object.fromEntries(
    ADMIN_ACCESS_PAGES.map((page) => [page.id, { ...modulePermissions }]),
  ) as AdminUserPageAccess;
}

function legacyLevelToPermissions(level: unknown): AdminModulePermissions {
  if (level && typeof level === "object") {
    return normalizeModulePermissions(level);
  }

  if (level === true || level === "write") {
    return getDefaultModulePermissions("full");
  }

  if (level === "read") {
    return getDefaultModulePermissions("read");
  }

  return emptyModulePermissions();
}

export function normalizeModulePermissions(raw: unknown): AdminModulePermissions {
  const permissions = emptyModulePermissions();

  if (!raw || typeof raw !== "object") {
    return permissions;
  }

  const record = raw as Record<string, unknown>;

  for (const permission of ADMIN_PAGE_PERMISSIONS) {
    if (typeof record[permission] === "boolean") {
      permissions[permission] = record[permission];
    }
  }

  return permissions;
}

export function normalizeUserPageAccess(raw: unknown): AdminUserPageAccess {
  if (!raw || typeof raw !== "object") {
    return getDefaultPageAccess();
  }

  const record = raw as Record<string, unknown>;

  return Object.fromEntries(
    ADMIN_ACCESS_PAGES.map((page) => [page.id, legacyLevelToPermissions(record[page.id])]),
  ) as AdminUserPageAccess;
}

export function normalizePageAccessMap(raw: unknown): AdminPageAccessMap {
  if (!raw || typeof raw !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(raw as Record<string, unknown>).map(([userId, pages]) => [
      userId,
      normalizeUserPageAccess(pages),
    ]),
  );
}

export function setModulePermission(
  access: AdminUserPageAccess,
  pageId: AdminAccessPageId,
  permission: AdminPagePermission,
  enabled: boolean,
): AdminUserPageAccess {
  const current = access[pageId] ?? emptyModulePermissions();

  return {
    ...access,
    [pageId]: {
      ...current,
      [permission]: enabled,
    },
  };
}

export function getMenuModulePermission(
  access: AdminUserPageAccess,
  moduleId: AdminAccessMenuModuleId,
  permission: AdminPagePermission,
): boolean {
  const module = ADMIN_ACCESS_MENU_MODULES.find((item) => item.id === moduleId);
  if (!module?.pageIds.length) {
    return false;
  }

  return module.pageIds.every((pageId) => getModulePermission(access, pageId, permission));
}

export function setMenuModulePermission(
  access: AdminUserPageAccess,
  moduleId: AdminAccessMenuModuleId,
  permission: AdminPagePermission,
  enabled: boolean,
): AdminUserPageAccess {
  const module = ADMIN_ACCESS_MENU_MODULES.find((item) => item.id === moduleId);
  if (!module) {
    return access;
  }

  return module.pageIds.reduce(
    (current, pageId) => setModulePermission(current, pageId, permission, enabled),
    access,
  );
}

export function getModulePermission(
  access: AdminUserPageAccess,
  pageId: AdminAccessPageId,
  permission: AdminPagePermission,
): boolean {
  return access[pageId]?.[permission] === true;
}

export function userHasPermission(
  access: AdminUserPageAccess,
  permission: AdminPagePermission,
): boolean {
  return ADMIN_ACCESS_PAGES.some((page) => getModulePermission(access, page.id, permission));
}
