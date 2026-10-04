import {
  getDefaultPageAccess,
  normalizePageAccessMap,
  normalizeUserPageAccess,
  type AdminPageAccessMap,
  type AdminUserPageAccess,
} from "@/lib/admin-page-access.config";
import { findStaticAdminByEmail } from "@/data/auth/users";
import {
  DEFAULT_ADMIN_ROLE_IDS,
  ensureAdminRolesSeeded,
  findAdminRoleById,
  resolveDefaultRoleIdForLegacyRole,
} from "@/lib/admin-roles";
import {
  emptyAdminUserAddress,
  getAdminUserFullName,
  type AdminUserInput,
  type AdminUserRecord,
  type AdminUserRole,
} from "@/lib/admin-users.config";
import { ADMIN_AUTH, ADMIN_PAGE_ACCESS_KEY, ADMIN_USERS_STORE_KEY } from "@/lib/constants";
import { DEFAULT_PHONE_COUNTRY_CODE } from "@/lib/phone-countries.config";
import { formatPhoneParts } from "@/lib/utils/phone";

export type { AdminUserInput, AdminUserRecord, AdminUserRole } from "@/lib/admin-users.config";
export { ADMIN_USER_ROLES, getAdminUserFullName } from "@/lib/admin-users.config";
export type { AdminPageAccessMap, AdminPagePermission, AdminUserPageAccess, AdminModulePermissions } from "@/lib/admin-page-access.config";
export {
  getDefaultPageAccess,
  getNewUserPageAccess,
  getModulePermission,
  setModulePermission,
  userHasPermission,
} from "@/lib/admin-page-access.config";

export const ADMIN_USERS_UPDATED_EVENT = "hakimi:admin-users-updated";

const DEFAULT_ADMIN_USER_ID = "user-administrator";

function readUsersJson(): unknown {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const fromLocal = window.localStorage.getItem(ADMIN_USERS_STORE_KEY);
    if (fromLocal) {
      return JSON.parse(fromLocal) as unknown;
    }

    const fromSession = window.sessionStorage.getItem(ADMIN_USERS_STORE_KEY);
    if (!fromSession) {
      return null;
    }

    window.localStorage.setItem(ADMIN_USERS_STORE_KEY, fromSession);
    window.sessionStorage.removeItem(ADMIN_USERS_STORE_KEY);
    return JSON.parse(fromSession) as unknown;
  } catch {
    return null;
  }
}

function writeUsersJson(users: AdminUserRecord[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ADMIN_USERS_STORE_KEY, JSON.stringify(users));
  window.sessionStorage.removeItem(ADMIN_USERS_STORE_KEY);
}

function buildDefaultUsers(now: string): AdminUserRecord[] {
  ensureAdminRolesSeeded();

  const staticUser = findStaticAdminByEmail(ADMIN_AUTH.demoEmail);
  const displayName = staticUser?.name ?? "Admin User";
  const nameParts = displayName.split(/\s+/).filter(Boolean);
  const addressDefaults = emptyAdminUserAddress();

  return [
    {
      id: DEFAULT_ADMIN_USER_ID,
      username: "admin",
      firstName: nameParts[0] ?? "Admin",
      lastName: nameParts.slice(1).join(" ") || "User",
      email: ADMIN_AUTH.demoEmail.toLowerCase(),
      phoneCountryCode: DEFAULT_PHONE_COUNTRY_CODE,
      phoneNumber: "",
      image: "",
      designation: "Administrator",
      ...addressDefaults,
      role: staticUser?.role ?? "admin",
      roleId: DEFAULT_ADMIN_ROLE_IDS.administrator,
      active: staticUser?.status !== "inactive",
      createdAt: now,
      updatedAt: now,
    },
  ];
}

function ensureAdminUsersSeeded(): AdminUserRecord[] {
  const existing = sanitizeUsers(readUsersJson());
  if (existing.length) {
    return existing;
  }

  const seeded = buildDefaultUsers(new Date().toISOString());
  writeUsersJson(seeded);
  return seeded;
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(key, JSON.stringify(value));
}

function notifyUsersUpdated() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(ADMIN_USERS_UPDATED_EVENT));
}

function normalizeLegacyUser(raw: Record<string, unknown>): AdminUserRecord | null {
  const email = typeof raw.email === "string" ? raw.email.trim().toLowerCase() : "";
  if (!email) {
    return null;
  }

  const legacyName = typeof raw.name === "string" ? raw.name.trim() : "";
  const nameParts = legacyName.split(/\s+/).filter(Boolean);
  const firstName =
    typeof raw.firstName === "string" && raw.firstName.trim()
      ? raw.firstName.trim()
      : (nameParts[0] ?? "");
  const lastName =
    typeof raw.lastName === "string" && raw.lastName.trim()
      ? raw.lastName.trim()
      : (nameParts.slice(1).join(" ") ?? "");

  const phoneCountryCode =
    typeof raw.phoneCountryCode === "string" && raw.phoneCountryCode.trim()
      ? raw.phoneCountryCode.trim()
      : DEFAULT_PHONE_COUNTRY_CODE;
  const phoneNumber =
    typeof raw.phoneNumber === "string"
      ? raw.phoneNumber.replace(/\D/g, "")
      : typeof raw.phone === "string"
        ? raw.phone.replace(/\D/g, "")
        : "";

  const role =
    raw.role === "admin" || raw.role === "editor" || raw.role === "viewer" ? raw.role : "viewer";

  const roleId =
    typeof raw.roleId === "string" && raw.roleId.trim()
      ? raw.roleId.trim()
      : resolveDefaultRoleIdForLegacyRole(role);

  const legacyHomeAddress =
    typeof raw.homeAddress === "string" ? raw.homeAddress.trim() : "";
  const addressDefaults = emptyAdminUserAddress();
  const createdAt =
    typeof raw.createdAt === "string" && raw.createdAt.trim()
      ? raw.createdAt
      : new Date().toISOString();

  return {
    id: typeof raw.id === "string" && raw.id.trim() ? raw.id : crypto.randomUUID(),
    username: typeof raw.username === "string" ? raw.username.trim() : undefined,
    firstName,
    lastName,
    email,
    phoneCountryCode,
    phoneNumber,
    image: typeof raw.image === "string" ? raw.image : "",
    designation: typeof raw.designation === "string" ? raw.designation.trim() : "",
    addressLine1:
      typeof raw.addressLine1 === "string" && raw.addressLine1.trim()
        ? raw.addressLine1.trim()
        : legacyHomeAddress || addressDefaults.addressLine1,
    addressLine2:
      typeof raw.addressLine2 === "string" ? raw.addressLine2.trim() : addressDefaults.addressLine2,
    village:
      typeof raw.village === "string" && raw.village.trim()
        ? raw.village.trim()
        : addressDefaults.village,
    city:
      typeof raw.city === "string" && raw.city.trim() ? raw.city.trim() : addressDefaults.city,
    pincode:
      typeof raw.pincode === "string" && raw.pincode.trim()
        ? raw.pincode.trim()
        : addressDefaults.pincode,
    state:
      typeof raw.state === "string" && raw.state.trim() ? raw.state.trim() : addressDefaults.state,
    role,
    roleId,
    active: typeof raw.active === "boolean" ? raw.active : true,
    createdAt,
    updatedAt:
      typeof raw.updatedAt === "string" && raw.updatedAt.trim() ? raw.updatedAt : createdAt,
    lastLoginAt:
      typeof raw.lastLoginAt === "string" && raw.lastLoginAt.trim() ? raw.lastLoginAt : undefined,
  };
}

function sanitizeUsers(input: unknown): AdminUserRecord[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => (item && typeof item === "object" ? normalizeLegacyUser(item as Record<string, unknown>) : null))
    .filter((item): item is AdminUserRecord => Boolean(item));
}

export function getAdminUsers(): AdminUserRecord[] {
  const users = sanitizeUsers(readUsersJson());
  if (users.length) {
    return users;
  }

  return ensureAdminUsersSeeded();
}

export function countAdminUsersWithRole(roleId: string): number {
  if (!roleId.trim()) {
    return 0;
  }

  return getAdminUsers().filter((user) => user.roleId === roleId).length;
}

export function ensureAdminUserForEmail(email: string | null | undefined): AdminUserRecord | undefined {
  if (!email?.trim()) {
    return undefined;
  }

  const normalized = email.trim().toLowerCase();
  const existing = getAdminUserByEmail(normalized);
  if (existing) {
    return existing;
  }

  const staticUser = findStaticAdminByEmail(normalized);
  if (!staticUser) {
    return undefined;
  }

  ensureAdminRolesSeeded();
  const nameParts = staticUser.name.split(/\s+/).filter(Boolean);
  const addressDefaults = emptyAdminUserAddress();

  const record: AdminUserRecord = {
    id: normalized === ADMIN_AUTH.demoEmail.toLowerCase() ? DEFAULT_ADMIN_USER_ID : crypto.randomUUID(),
    username: normalized.split("@")[0] ?? "user",
    firstName: nameParts[0] ?? "Admin",
    lastName: nameParts.slice(1).join(" ") || "User",
    email: normalized,
    phoneCountryCode: DEFAULT_PHONE_COUNTRY_CODE,
    phoneNumber: "",
    image: "",
    designation: staticUser.role === "admin" ? "Administrator" : staticUser.role,
    ...addressDefaults,
    role: staticUser.role,
    roleId: resolveDefaultRoleIdForLegacyRole(staticUser.role),
    active: staticUser.status === "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const users = getAdminUsers();
  if (users.some((user) => user.email === normalized)) {
    return getAdminUserByEmail(normalized);
  }

  users.unshift(record);
  writeUsersJson(users);
  notifyUsersUpdated();
  return record;
}

export function findAdminUserById(id: string): AdminUserRecord | undefined {
  return getAdminUsers().find((user) => user.id === id);
}

export function getAdminUserByEmail(email: string | null | undefined): AdminUserRecord | undefined {
  if (!email?.trim()) {
    return undefined;
  }

  const normalized = email.trim().toLowerCase();
  return getAdminUsers().find((user) => user.email.toLowerCase() === normalized);
}

function syncLegacyRoleFromRoleId(input: AdminUserInput): AdminUserInput {
  const roleRecord = input.roleId ? findAdminRoleById(input.roleId) : undefined;
  if (!roleRecord) {
    return input;
  }

  const name = roleRecord.name.toLowerCase();
  let role: AdminUserRole = input.role;
  if (name.includes("admin")) {
    role = "admin";
  } else if (name.includes("edit")) {
    role = "editor";
  } else if (name.includes("view")) {
    role = "viewer";
  }

  return { ...input, role };
}

export function saveAdminUser(input: AdminUserInput) {
  const users = getAdminUsers();
  const now = new Date().toISOString();
  const normalizedInput = syncLegacyRoleFromRoleId({
    ...input,
    roleId: input.roleId ?? resolveDefaultRoleIdForLegacyRole(input.role),
  });

  const record: AdminUserRecord = {
    ...normalizedInput,
    email: normalizedInput.email.trim().toLowerCase(),
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };

  users.unshift(record);
  writeUsersJson(users);
  notifyUsersUpdated();
  return record;
}

export function updateAdminUser(
  id: string,
  patch: Partial<AdminUserInput> & { lastLoginAt?: string },
) {
  const users = getAdminUsers();
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) {
    return undefined;
  }

  const current = users[index];
  const merged = syncLegacyRoleFromRoleId({
    ...current,
    ...patch,
    roleId: patch.roleId ?? current.roleId,
    role: patch.role ?? current.role,
  });

  const next: AdminUserRecord = {
    ...merged,
    id: current.id,
    createdAt: current.createdAt,
    email: patch.email?.trim().toLowerCase() ?? current.email,
    updatedAt: new Date().toISOString(),
    lastLoginAt: patch.lastLoginAt ?? current.lastLoginAt,
  };

  users[index] = next;
  writeUsersJson(users);
  notifyUsersUpdated();
  return next;
}

export function deleteAdminUser(id: string) {
  const users = getAdminUsers().filter((user) => user.id !== id);
  writeUsersJson(users);

  const access = getAdminPageAccessMap();
  delete access[id];
  writeJson(ADMIN_PAGE_ACCESS_KEY, access);

  notifyUsersUpdated();
}

export function getAdminUserPhone(user: AdminUserRecord) {
  return formatPhoneParts(user.phoneCountryCode, user.phoneNumber);
}

export function getAdminPageAccessMap(): AdminPageAccessMap {
  return normalizePageAccessMap(readJson(ADMIN_PAGE_ACCESS_KEY, {}));
}

export function getAdminUserPageAccess(userId: string): AdminUserPageAccess {
  const map = getAdminPageAccessMap();
  return normalizeUserPageAccess(map[userId]);
}

export function saveAdminPageAccess(userId: string, pages: AdminUserPageAccess) {
  const access = getAdminPageAccessMap();
  access[userId] = normalizeUserPageAccess(pages);
  writeJson(ADMIN_PAGE_ACCESS_KEY, access);
  notifyUsersUpdated();
}

export function deleteAdminPageAccess(userId: string) {
  const access = getAdminPageAccessMap();
  delete access[userId];
  writeJson(ADMIN_PAGE_ACCESS_KEY, access);
  notifyUsersUpdated();
}

export function getEffectiveUserAccess(userIdOrEmail: string): AdminUserPageAccess {
  const key = userIdOrEmail.trim();
  if (!key) {
    return getDefaultPageAccess("none");
  }

  const byId = findAdminUserById(key);
  const user = byId ?? getAdminUserByEmail(key);

  if (user?.roleId) {
    const role = findAdminRoleById(user.roleId);
    if (role?.active) {
      return role.permissions;
    }
  }

  if (user) {
    return getAdminUserPageAccess(user.id);
  }

  if (key.toLowerCase() === ADMIN_AUTH.demoEmail.toLowerCase()) {
    return getDefaultPageAccess("full");
  }

  return getDefaultPageAccess("full");
}

export function resolveAdminUserRole(email: string | null | undefined): AdminUserRole {
  return getAdminUserByEmail(email)?.role ?? "admin";
}

export function formatAdminUserLabel(user: AdminUserRecord) {
  const name = getAdminUserFullName(user);
  return name ? `${name} · ${user.email}` : user.email;
}

export function getAdminUserRoleLabel(user: AdminUserRecord): string {
  const role = user.roleId ? findAdminRoleById(user.roleId) : undefined;
  return role?.name ?? user.role;
}
