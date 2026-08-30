import { getDefaultTeamMembers } from "@/data/mock/team-members";
import { ADMIN_TEAM_STORE_KEY } from "@/lib/constants";
import {
  TEAM_MEMBER_KEY_PATTERN,
  type TeamMember,
} from "@/lib/team-members.config";

export const TEAM_MEMBERS_UPDATED_EVENT = "nexquanta:team-members-updated";

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

export function normalizeTeamMemberKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function generateUniqueTeamMemberKey(name: string, excludeKey?: string): string {
  const base = normalizeTeamMemberKey(name);
  const normalizedExclude = normalizeTeamMemberKey(excludeKey ?? "");
  const members = getTeamMembersState();

  if (!base || !TEAM_MEMBER_KEY_PATTERN.test(base)) {
    throw new Error("invalid");
  }

  let candidate = base;
  let suffix = 2;

  while (members.some((item) => item.key === candidate && item.key !== normalizedExclude)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

function sanitizeTeamMember(input: Partial<TeamMember>, fallback?: TeamMember): TeamMember | null {
  const key = normalizeTeamMemberKey(input.key ?? input.id ?? fallback?.key ?? "");
  const name = input.name?.trim() ?? fallback?.name ?? "";

  if (!key || !name) {
    return fallback ?? null;
  }

  return {
    id: key,
    key,
    name,
    role: input.role?.trim() ?? fallback?.role ?? "",
    crunch: input.crunch?.trim() ?? fallback?.crunch ?? "",
    body: input.body?.trim() ?? fallback?.body ?? "",
    phone: input.phone?.trim() ?? fallback?.phone ?? "",
    email: input.email?.trim() ?? fallback?.email ?? "",
    image: input.image?.trim() ?? fallback?.image ?? "",
    visible: input.visible ?? fallback?.visible ?? true,
  };
}

function parseStoredTeamMembers(raw: unknown): TeamMember[] {
  if (!Array.isArray(raw) || !raw.length) {
    return getDefaultTeamMembers();
  }

  return raw
    .map((item) => sanitizeTeamMember((item ?? {}) as Partial<TeamMember>))
    .filter((item): item is TeamMember => Boolean(item));
}

function persistTeamMembers(members: TeamMember[]) {
  writeJson(ADMIN_TEAM_STORE_KEY, members);
  window.dispatchEvent(new CustomEvent(TEAM_MEMBERS_UPDATED_EVENT));
}

export function getTeamMembersState(): TeamMember[] {
  return parseStoredTeamMembers(readJson(ADMIN_TEAM_STORE_KEY, null));
}

export function saveTeamMembersState(members: TeamMember[]) {
  const nextState = members
    .map((item) => sanitizeTeamMember(item))
    .filter((item): item is TeamMember => Boolean(item));

  persistTeamMembers(nextState.length ? nextState : getDefaultTeamMembers());
}

export function findTeamMemberById(id: string): TeamMember | undefined {
  const normalized = normalizeTeamMemberKey(id);
  return getTeamMembersState().find((item) => item.id === normalized);
}

export function addTeamMember(member: Omit<TeamMember, "id" | "key">): TeamMember[] {
  const key = generateUniqueTeamMemberKey(member.name);
  const nextMember = sanitizeTeamMember({ ...member, key });

  if (!nextMember) {
    throw new Error("invalid");
  }

  const nextState = [...getTeamMembersState(), nextMember];
  persistTeamMembers(nextState);
  return nextState;
}

export function updateTeamMember(
  currentKey: string,
  patch: Omit<Partial<TeamMember>, "id" | "key">,
): TeamMember[] {
  const normalizedCurrent = normalizeTeamMemberKey(currentKey);
  const current = getTeamMembersState();
  const index = current.findIndex((item) => item.key === normalizedCurrent);

  if (index < 0) {
    throw new Error("not-found");
  }

  const nextMember = sanitizeTeamMember({ ...current[index], ...patch }, current[index]);
  if (!nextMember) {
    throw new Error("invalid");
  }

  const nextState = current.map((item, itemIndex) => (itemIndex === index ? nextMember : item));
  persistTeamMembers(nextState);
  return nextState;
}

export function deleteTeamMember(id: string): TeamMember[] {
  const normalized = normalizeTeamMemberKey(id);
  const current = getTeamMembersState();
  const nextState = current.filter((item) => item.key !== normalized);

  if (nextState.length === current.length) {
    throw new Error("not-found");
  }

  persistTeamMembers(nextState);
  return nextState;
}

export function getVisibleTeamMembers(members: TeamMember[]): TeamMember[] {
  return members.filter((member) => member.visible && member.name.trim());
}
