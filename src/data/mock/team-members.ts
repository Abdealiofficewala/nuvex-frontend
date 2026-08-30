import { siteConfig } from "@/config/site.config";
import { LEADERSHIP_KEYS } from "@/lib/constants";
import {
  DEFAULT_TEAM_MEMBER_SEEDS,
  type TeamMember,
  type TeamMemberSeed,
} from "@/lib/team-members.config";
import type { CompanyLeader } from "@/types/company";

function resolveLeadershipContact(key: string): CompanyLeader | undefined {
  if (key === LEADERSHIP_KEYS.ceo) {
    return siteConfig.leadership.ceo;
  }

  if (key === LEADERSHIP_KEYS.cfo) {
    return siteConfig.leadership.cfo;
  }

  return undefined;
}

export function buildTeamMember(seed: TeamMemberSeed): TeamMember {
  const leadership = resolveLeadershipContact(seed.key);

  return {
    id: seed.key,
    key: seed.key,
    name: leadership?.name ?? "",
    role: leadership?.role ?? seed.role,
    crunch: seed.crunch,
    body: seed.body,
    phone: leadership?.phone ?? "",
    email: leadership?.email ?? "",
    image: leadership?.image ?? "",
    visible: true,
  };
}

export function getDefaultTeamMembers(): TeamMember[] {
  return DEFAULT_TEAM_MEMBER_SEEDS.map((seed) => buildTeamMember(seed));
}
