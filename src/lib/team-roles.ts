import { getDefaultTeamRoles } from "@/data/mock/team-roles";
import { ADMIN_TEAM_ROLES_STORE_KEY } from "@/lib/constants";
import { TEAM_ROLE_VALUE_PATTERN, type TeamRole } from "@/lib/team-roles.config";

export const TEAM_ROLES_UPDATED_EVENT = "nexquanta:team-roles-updated";

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

export function normalizeTeamRoleValue(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function sanitizeTeamRole(input: Partial<TeamRole>, fallback?: TeamRole): TeamRole | null {
  const label = input.label?.trim() ?? fallback?.label ?? "";
  const value = normalizeTeamRoleValue(input.value ?? fallback?.value ?? "");
  const id = input.id?.trim() || value || fallback?.id || "";

  if (!label || !value || !TEAM_ROLE_VALUE_PATTERN.test(value)) {
    return fallback ?? null;
  }

  return { id, label, value };
}

function parseStoredTeamRoles(raw: unknown): TeamRole[] {
  if (!Array.isArray(raw) || !raw.length) {
    return getDefaultTeamRoles();
  }

  return raw
    .map((item) => sanitizeTeamRole((item ?? {}) as Partial<TeamRole>))
    .filter((item): item is TeamRole => Boolean(item));
}

function persistTeamRoles(roles: TeamRole[]) {
  writeJson(ADMIN_TEAM_ROLES_STORE_KEY, roles);
  window.dispatchEvent(new CustomEvent(TEAM_ROLES_UPDATED_EVENT));
}

export function getTeamRolesState(): TeamRole[] {
  return parseStoredTeamRoles(readJson(ADMIN_TEAM_ROLES_STORE_KEY, null));
}

export function saveTeamRolesState(roles: TeamRole[]) {
  const nextState = roles
    .map((item) => sanitizeTeamRole(item))
    .filter((item): item is TeamRole => Boolean(item));

  persistTeamRoles(nextState.length ? nextState : getDefaultTeamRoles());
}

export function addTeamRole(role: Pick<TeamRole, "label" | "value">): TeamRole[] {
  const nextRole = sanitizeTeamRole(role);
  if (!nextRole) {
    return getTeamRolesState();
  }

  const current = getTeamRolesState();
  const exists = current.some((item) => item.value === nextRole.value);
  if (exists) {
    throw new Error("duplicate");
  }

  const nextState = [...current, nextRole];
  persistTeamRoles(nextState);
  return nextState;
}

export function updateTeamRole(
  currentValue: string,
  patch: Pick<TeamRole, "label" | "value">,
): TeamRole[] {
  const normalizedCurrent = normalizeTeamRoleValue(currentValue);
  const nextRole = sanitizeTeamRole(patch);
  if (!nextRole) {
    return getTeamRolesState();
  }

  const current = getTeamRolesState();
  const index = current.findIndex((item) => item.value === normalizedCurrent);
  if (index < 0) {
    throw new Error("not-found");
  }

  const duplicate = current.some(
    (item, itemIndex) => itemIndex !== index && item.value === nextRole.value,
  );
  if (duplicate) {
    throw new Error("duplicate");
  }

  const nextState = current.map((item, itemIndex) => (itemIndex === index ? nextRole : item));
  persistTeamRoles(nextState);
  return nextState;
}

export function deleteTeamRole(value: string): TeamRole[] {
  const normalized = normalizeTeamRoleValue(value);
  const current = getTeamRolesState();
  const nextState = current.filter((item) => item.value !== normalized);

  if (nextState.length === current.length) {
    throw new Error("not-found");
  }

  persistTeamRoles(nextState);
  return nextState;
}

export function findTeamRoleByValue(value: string): TeamRole | undefined {
  const normalized = normalizeTeamRoleValue(value);
  return getTeamRolesState().find((item) => item.value === normalized);
}
