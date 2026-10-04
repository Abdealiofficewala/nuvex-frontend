import {
  getDefaultPageAccess,
  getNewUserPageAccess,
  normalizeUserPageAccess,
  type AdminUserPageAccess,
} from "@/lib/admin-page-access.config";
import { ADMIN_ROLES_STORE_KEY } from "@/lib/constants";

export const DEFAULT_ADMIN_ROLE_IDS = {
  administrator: "role-administrator",
  editor: "role-editor",
  viewer: "role-viewer",
} as const;

export type AdminRoleRecord = {
  id: string;
  name: string;
  description: string;
  active: boolean;
  permissions: AdminUserPageAccess;
  createdAt: string;
  updatedAt: string;
};

export type AdminRoleInput = Omit<AdminRoleRecord, "id" | "createdAt" | "updatedAt">;

export const ADMIN_ROLES_UPDATED_EVENT = "hakimi:admin-roles-updated";

function readRolesJson(): unknown {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(ADMIN_ROLES_STORE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeRolesJson(roles: AdminRoleRecord[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ADMIN_ROLES_STORE_KEY, JSON.stringify(roles));
}

function notifyRolesUpdated() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(ADMIN_ROLES_UPDATED_EVENT));
}

function buildEditorPermissions(): AdminUserPageAccess {
  const access = getNewUserPageAccess();
  const full = getDefaultPageAccess("full");

  return Object.fromEntries(
    Object.keys(access).map((pageId) => {
      const pageKey = pageId as keyof AdminUserPageAccess;
      const preset = access[pageKey]?.create ? full[pageKey] : access[pageKey];
      return [pageId, preset ?? access[pageKey]];
    }),
  ) as AdminUserPageAccess;
}

function buildDefaultRoles(now: string): AdminRoleRecord[] {
  return [
    {
      id: DEFAULT_ADMIN_ROLE_IDS.administrator,
      name: "Administrator",
      description: "Full access to every admin module and action.",
      active: true,
      permissions: getDefaultPageAccess("full"),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: DEFAULT_ADMIN_ROLE_IDS.editor,
      name: "Editor",
      description: "Can manage catalogue and content modules.",
      active: true,
      permissions: buildEditorPermissions(),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: DEFAULT_ADMIN_ROLE_IDS.viewer,
      name: "Viewer",
      description: "Read-only access across the admin panel.",
      active: true,
      permissions: getDefaultPageAccess("read"),
      createdAt: now,
      updatedAt: now,
    },
  ];
}

function normalizeRole(raw: Record<string, unknown>): AdminRoleRecord | null {
  const id = typeof raw.id === "string" && raw.id.trim() ? raw.id.trim() : "";
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  if (!id || !name) {
    return null;
  }

  const now = new Date().toISOString();

  return {
    id,
    name,
    description: typeof raw.description === "string" ? raw.description.trim() : "",
    active: typeof raw.active === "boolean" ? raw.active : true,
    permissions: normalizeUserPageAccess(raw.permissions),
    createdAt:
      typeof raw.createdAt === "string" && raw.createdAt.trim() ? raw.createdAt : now,
    updatedAt:
      typeof raw.updatedAt === "string" && raw.updatedAt.trim() ? raw.updatedAt : now,
  };
}

function sanitizeRoles(input: unknown): AdminRoleRecord[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => (item && typeof item === "object" ? normalizeRole(item as Record<string, unknown>) : null))
    .filter((item): item is AdminRoleRecord => Boolean(item));
}

export function ensureAdminRolesSeeded(): AdminRoleRecord[] {
  const existing = sanitizeRoles(readRolesJson());
  if (existing.length) {
    return existing;
  }

  const seeded = buildDefaultRoles(new Date().toISOString());
  writeRolesJson(seeded);
  return seeded;
}

export function getAdminRoles(): AdminRoleRecord[] {
  const roles = sanitizeRoles(readRolesJson());
  if (roles.length) {
    return roles;
  }

  return ensureAdminRolesSeeded();
}

export function findAdminRoleById(id: string | null | undefined): AdminRoleRecord | undefined {
  if (!id?.trim()) {
    return undefined;
  }

  return getAdminRoles().find((role) => role.id === id.trim());
}

export function resolveDefaultRoleIdForLegacyRole(role: "admin" | "editor" | "viewer"): string {
  if (role === "admin") {
    return DEFAULT_ADMIN_ROLE_IDS.administrator;
  }

  if (role === "editor") {
    return DEFAULT_ADMIN_ROLE_IDS.editor;
  }

  return DEFAULT_ADMIN_ROLE_IDS.viewer;
}

export function saveAdminRole(input: AdminRoleInput): AdminRoleRecord {
  const roles = getAdminRoles();
  const now = new Date().toISOString();
  const record: AdminRoleRecord = {
    ...input,
    permissions: normalizeUserPageAccess(input.permissions),
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };

  roles.unshift(record);
  writeRolesJson(roles);
  notifyRolesUpdated();
  return record;
}

export function updateAdminRole(id: string, patch: Partial<AdminRoleInput>): AdminRoleRecord | undefined {
  const roles = getAdminRoles();
  const index = roles.findIndex((role) => role.id === id);

  if (index === -1) {
    return undefined;
  }

  const current = roles[index];
  const next: AdminRoleRecord = {
    ...current,
    ...patch,
    id: current.id,
    createdAt: current.createdAt,
    permissions: patch.permissions
      ? normalizeUserPageAccess(patch.permissions)
      : current.permissions,
    updatedAt: new Date().toISOString(),
  };

  roles[index] = next;
  writeRolesJson(roles);
  notifyRolesUpdated();
  return next;
}

export function deleteAdminRole(id: string) {
  const roles = getAdminRoles().filter((role) => role.id !== id);
  writeRolesJson(roles);
  notifyRolesUpdated();
}
