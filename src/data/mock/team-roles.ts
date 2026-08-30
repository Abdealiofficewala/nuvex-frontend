import { DEFAULT_TEAM_ROLE_SEEDS, type TeamRole, type TeamRoleSeed } from "@/lib/team-roles.config";

export function buildTeamRole(seed: TeamRoleSeed): TeamRole {
  return {
    id: seed.value,
    label: seed.label,
    value: seed.value,
  };
}

export function getDefaultTeamRoles(): TeamRole[] {
  return DEFAULT_TEAM_ROLE_SEEDS.map((seed) => buildTeamRole(seed));
}
