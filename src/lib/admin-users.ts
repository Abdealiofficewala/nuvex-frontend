import {
  getNewUserPageAccess,
  normalizePageAccessMap,
  normalizeUserPageAccess,
  type AdminPageAccessMap,
  type AdminUserPageAccess,
} from "@/lib/admin-page-access.config";
import {
  emptyAdminUserAddress,
  getAdminUserFullName,
  type AdminUserInput,
  type AdminUserRecord,
  type AdminUserRole,
} from "@/lib/admin-users.config";
import { ADMIN_PAGE_ACCESS_KEY, ADMIN_USERS_STORE_KEY } from "@/lib/constants";
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

  const legacyHomeAddress =
    typeof raw.homeAddress === "string" ? raw.homeAddress.trim() : "";
  const addressDefaults = emptyAdminUserAddress();

  return {
    id: typeof raw.id === "string" && raw.id.trim() ? raw.id : crypto.randomUUID(),
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
    active: typeof raw.active === "boolean" ? raw.active : true,
    createdAt:
      typeof raw.createdAt === "string" && raw.createdAt.trim()
        ? raw.createdAt
        : new Date().toISOString(),
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
  return sanitizeUsers(readJson(ADMIN_USERS_STORE_KEY, null));
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

export function saveAdminUser(input: AdminUserInput, pageAccess?: AdminUserPageAccess) {
  const users = getAdminUsers();
  const record: AdminUserRecord = {
    ...input,
    email: input.email.trim().toLowerCase(),
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  users.unshift(record);
  writeJson(ADMIN_USERS_STORE_KEY, users);

  const access = getAdminPageAccessMap();
  access[record.id] = pageAccess ?? getNewUserPageAccess();
  writeJson(ADMIN_PAGE_ACCESS_KEY, access);

  notifyUsersUpdated();
  return record;
}

export function updateAdminUser(id: string, patch: Partial<AdminUserInput>) {
  const users = getAdminUsers();
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) {
    return undefined;
  }

  const current = users[index];
  const next: AdminUserRecord = {
    ...current,
    ...patch,
    id: current.id,
    createdAt: current.createdAt,
    email: patch.email?.trim().toLowerCase() ?? current.email,
  };

  users[index] = next;
  writeJson(ADMIN_USERS_STORE_KEY, users);
  notifyUsersUpdated();
  return next;
}

export function deleteAdminUser(id: string) {
  const users = getAdminUsers().filter((user) => user.id !== id);
  writeJson(ADMIN_USERS_STORE_KEY, users);

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

export function resolveAdminUserRole(email: string | null | undefined): AdminUserRole {
  return getAdminUserByEmail(email)?.role ?? "admin";
}

export function formatAdminUserLabel(user: AdminUserRecord) {
  const name = getAdminUserFullName(user);
  return name ? `${name} · ${user.email}` : user.email;
}
