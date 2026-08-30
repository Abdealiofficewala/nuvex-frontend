export type TeamRole = {
  id: string;
  label: string;
  value: string;
};

export const TEAM_ROLE_VALUE_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type TeamRoleSeed = {
  value: string;
  label: string;
};

export const DEFAULT_TEAM_ROLE_SEEDS: readonly TeamRoleSeed[] = [
  { value: "ceo", label: "Founder & CEO" },
  { value: "cfo", label: "Chief Financial Officer" },
] as const;
