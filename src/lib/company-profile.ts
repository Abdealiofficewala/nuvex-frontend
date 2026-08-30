import { siteConfig } from "@/config/site.config";
import { ADMIN_COMPANY_PROFILE_STORE_KEY } from "@/lib/constants";
import {
  COMPANY_PROFILE_FIELDS,
  DEFAULT_TICKET_COPY,
  type CompanyProfileField,
  type CompanyProfileState,
} from "@/lib/company-profile.config";
import { companyTicketSerial } from "@/lib/constants";
import { formatAddress, phoneHref } from "@/lib/utils";
import type { CompanyFactRow } from "@/types/content";

export const COMPANY_PROFILE_UPDATED_EVENT = "nexquanta:company-profile-updated";

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

function sanitizeProfile(input: Partial<CompanyProfileState> | null | undefined): CompanyProfileState {
  const defaults = getDefaultCompanyProfile();

  return COMPANY_PROFILE_FIELDS.reduce((acc, field) => {
    acc[field] = input?.[field]?.trim() ?? defaults[field];
    return acc;
  }, {} as CompanyProfileState);
}

export function getDefaultCompanyProfile(): CompanyProfileState {
  const { company, contact } = siteConfig;

  return {
    ticketEyebrow: DEFAULT_TICKET_COPY.ticketEyebrow,
    ticketTitle: DEFAULT_TICKET_COPY.ticketTitle,
    name: company.name,
    shortName: company.shortName,
    tagline: company.tagline,
    description: company.description,
    foundedYear: String(company.foundedYear),
    hqCity: contact.address.city,
    hqState: contact.address.state,
    hqCountry: contact.address.country,
    deskAddress: formatAddress(contact.address),
    productLines: DEFAULT_TICKET_COPY.productLines,
    reach: DEFAULT_TICKET_COPY.reach,
    email: contact.email,
    phone: contact.phone,
  };
}

export function getCompanyProfileState(): CompanyProfileState {
  return sanitizeProfile(readJson<Partial<CompanyProfileState> | null>(ADMIN_COMPANY_PROFILE_STORE_KEY, null));
}

export function saveCompanyProfileState(state: CompanyProfileState) {
  const nextState = sanitizeProfile(state);
  writeJson(ADMIN_COMPANY_PROFILE_STORE_KEY, nextState);
  window.dispatchEvent(new CustomEvent(COMPANY_PROFILE_UPDATED_EVENT));
}

export function resetCompanyProfileState(): CompanyProfileState {
  const defaults = getDefaultCompanyProfile();
  saveCompanyProfileState(defaults);
  return defaults;
}

export function resolveFoundedYear(profile: CompanyProfileState): number {
  const parsed = Number.parseInt(profile.foundedYear, 10);
  if (Number.isFinite(parsed) && parsed >= 1800 && parsed <= 2100) {
    return parsed;
  }

  return siteConfig.company.foundedYear;
}

export function resolveHqLine(profile: CompanyProfileState): string {
  return [profile.hqCity, profile.hqState, profile.hqCountry].filter(Boolean).join(", ");
}

export type CompanyProfileFactLabels = {
  legal: string;
  founded: string;
  hq: string;
  desk: string;
  lines: string;
  reach: string;
  enquiries: string;
  phone: string;
};

export function buildCompanyProfileFacts(
  profile: CompanyProfileState,
  labels: CompanyProfileFactLabels,
): CompanyFactRow[] {
  return [
    { label: labels.legal, value: profile.name },
    { label: labels.founded, value: profile.foundedYear },
    { label: labels.hq, value: resolveHqLine(profile) },
    { label: labels.desk, value: profile.deskAddress },
    { label: labels.lines, value: profile.productLines },
    { label: labels.reach, value: profile.reach },
    {
      label: labels.enquiries,
      value: profile.email,
      href: profile.email ? `mailto:${profile.email}` : undefined,
    },
    {
      label: labels.phone,
      value: profile.phone,
      href: profile.phone ? phoneHref(profile.phone) : undefined,
    },
  ].filter((item) => item.value);
}

export function getCompanyProfileTicketSerial(profile: CompanyProfileState): string {
  return companyTicketSerial(resolveFoundedYear(profile));
}

export function touchCompanyProfileField(
  touched: Partial<Record<CompanyProfileField, boolean>>,
  field: CompanyProfileField,
): Partial<Record<CompanyProfileField, boolean>> {
  return { ...touched, [field]: true };
}

export function touchAllCompanyProfileFields(): Partial<Record<CompanyProfileField, boolean>> {
  return COMPANY_PROFILE_FIELDS.reduce(
    (acc, field) => {
      acc[field] = true;
      return acc;
    },
    {} as Partial<Record<CompanyProfileField, boolean>>,
  );
}
