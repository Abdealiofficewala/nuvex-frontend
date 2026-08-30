import type { AboutPersonSeed, DeskPerson } from "@/types/content";
import type { CompanyLeadership } from "@/types/company";
import { LEADERSHIP_KEYS } from "@/lib/constants";

export function toDeskPerson(person: AboutPersonSeed, leadership?: CompanyLeadership): DeskPerson {
  const lead =
    person.key === LEADERSHIP_KEYS.ceo
      ? leadership?.ceo
      : person.key === LEADERSHIP_KEYS.cfo
        ? leadership?.cfo
        : undefined;

  return {
    ...person,
    name: lead?.name ?? "",
    phone: lead?.phone,
    email: lead?.email,
    image: lead?.image,
    role: lead?.role || person.role,
  };
}
