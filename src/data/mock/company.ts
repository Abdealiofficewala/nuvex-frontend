import { siteConfig } from "@/config/site.config";
import type { Company, CompanyLeader, CompanyLeadership } from "@/types/company";

export const mockCompany: Company = {
  id: "company-hakimi",
  name: siteConfig.company.name,
  shortName: siteConfig.company.shortName,
  tagline: siteConfig.company.tagline,
  description: siteConfig.company.description,
  person: siteConfig.contact.person,
  email: siteConfig.contact.email,
  phone: siteConfig.contact.phone,
  phones: [...siteConfig.contact.phones],
  address: { ...siteConfig.contact.address },
  mapQuery: siteConfig.contact.mapQuery,
  social: { ...siteConfig.social },
  leadership: {
    ceo: { ...siteConfig.leadership.ceo },
    cfo: { ...siteConfig.leadership.cfo },
  },
};

export const mockLeadership: CompanyLeadership = {
  ceo: mockCompany.leadership?.ceo,
  cfo: mockCompany.leadership?.cfo,
};

export const mockLeaders: CompanyLeader[] = [
  mockLeadership.ceo,
  mockLeadership.cfo,
].filter((person): person is CompanyLeader => Boolean(person?.name));
