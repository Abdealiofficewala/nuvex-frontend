export const COMPANY_PROFILE_FIELDS = [
  "ticketEyebrow",
  "ticketTitle",
  "name",
  "shortName",
  "tagline",
  "description",
  "foundedYear",
  "hqCity",
  "hqState",
  "hqCountry",
  "deskAddress",
  "productLines",
  "reach",
  "email",
  "phone",
] as const;

export type CompanyProfileField = (typeof COMPANY_PROFILE_FIELDS)[number];

export type CompanyProfileState = Record<CompanyProfileField, string>;

export const DEFAULT_TICKET_COPY = {
  ticketEyebrow: "On the ticket",
  ticketTitle: "Company details. No brochure fog.",
  productLines: "Bolts, nuts, screws, nails",
  reach: "18+ states and export",
} as const;
