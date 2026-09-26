export const COMPANY_PROFILE_FIELDS = [
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

export const DEFAULT_COMPANY_FACT_DEFAULTS = {
  productLines: "Bolts, nuts, screws, nails",
  reach: "18+ states and export",
} as const;
