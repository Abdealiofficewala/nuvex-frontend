import { siteConfig } from "@/config/site.config";
import { ADMIN_CONTACT_STORE_KEY } from "@/lib/constants";
import {
  CONTACT_PHONE_KEYS,
  type ContactDetailsState,
  type ContactPhone,
  type ContactPhoneKey,
} from "@/lib/contact-details.config";
import { DEFAULT_PHONE_COUNTRY_CODE } from "@/lib/phone-countries.config";
import { formatAddress } from "@/lib/utils";
import { formatPhoneParts, parsePhoneParts } from "@/lib/utils/phone";

export const CONTACT_DETAILS_UPDATED_EVENT = "hakimi:contact-details-updated";

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

function normalizePhoneRecord(
  key: ContactPhoneKey,
  input: Partial<ContactPhone> | undefined,
  fallbackLabel: string,
  fallbackValue = "",
): ContactPhone {
  const rawValue = input?.value?.trim() || fallbackValue;
  const parsed = parsePhoneParts(rawValue);

  const countryCode = input?.countryCode?.trim() || parsed.countryCode || DEFAULT_PHONE_COUNTRY_CODE;
  const number = input?.number?.replace(/[^\d]/g, "") || parsed.number;
  const value = formatPhoneParts(countryCode, number) || rawValue;

  return {
    key,
    label: input?.label?.trim() || fallbackLabel,
    countryCode,
    number,
    value,
  };
}

function buildDefaultPhones(): ContactPhone[] {
  const phones = siteConfig.contact.phones ?? [];

  return CONTACT_PHONE_KEYS.map((key) => {
    const match = phones.find((item) => item.key === key);
    return normalizePhoneRecord(
      key,
      match ? { key, label: match.label, value: match.value } : undefined,
      key === "whatsapp" ? "WhatsApp" : "Mobile",
      match?.value ?? "",
    );
  });
}

export function getDefaultContactDetails(): ContactDetailsState {
  const { contact } = siteConfig;

  return {
    person: contact.person ?? "",
    email: contact.email ?? "",
    phone: contact.phone ?? "",
    phones: buildDefaultPhones(),
    address: {
      street: contact.address?.street ?? "",
      city: contact.address?.city ?? "",
      state: contact.address?.state ?? "",
      country: contact.address?.country ?? "",
      postalCode: contact.address?.postalCode ?? "",
    },
    mapQuery: contact.mapQuery ?? "",
  };
}

function sanitizePhones(input: ContactPhone[] | undefined): ContactPhone[] {
  const defaults = buildDefaultPhones();

  return CONTACT_PHONE_KEYS.map((key, index) => {
    const match = input?.find((item) => item.key === key);
    return normalizePhoneRecord(key, match ?? defaults[index], defaults[index].label, defaults[index].value);
  });
}

function parseStoredContactDetails(raw: unknown): ContactDetailsState {
  if (!raw || typeof raw !== "object") {
    return getDefaultContactDetails();
  }

  const record = raw as Partial<ContactDetailsState>;
  const defaults = getDefaultContactDetails();

  return {
    person: record.person?.trim() ?? defaults.person,
    email: record.email?.trim() ?? defaults.email,
    phone: record.phone?.trim() ?? defaults.phone,
    phones: sanitizePhones(record.phones),
    address: {
      street: record.address?.street?.trim() ?? defaults.address.street,
      city: record.address?.city?.trim() ?? defaults.address.city,
      state: record.address?.state?.trim() ?? defaults.address.state,
      country: record.address?.country?.trim() ?? defaults.address.country,
      postalCode: record.address?.postalCode?.trim() ?? defaults.address.postalCode,
    },
    mapQuery: record.mapQuery?.trim() ?? defaults.mapQuery,
  };
}

export function getContactDetailsState(): ContactDetailsState {
  return parseStoredContactDetails(readJson(ADMIN_CONTACT_STORE_KEY, null));
}

export function getContactPhoneValue(state: ContactDetailsState, key: ContactPhoneKey): string {
  const phone = state.phones.find((item) => item.key === key);
  if (!phone) {
    return "";
  }

  return phone.value || formatPhoneParts(phone.countryCode, phone.number);
}

export function saveContactDetailsState(state: ContactDetailsState) {
  const nextState = parseStoredContactDetails(state);
  writeJson(ADMIN_CONTACT_STORE_KEY, nextState);
  window.dispatchEvent(new CustomEvent(CONTACT_DETAILS_UPDATED_EVENT));
}

export function getEmptyContactDetailsState(): ContactDetailsState {
  return {
    person: "",
    email: "",
    phone: "",
    phones: CONTACT_PHONE_KEYS.map((key) => ({
      key,
      label: key === "whatsapp" ? "WhatsApp" : "Mobile",
      countryCode: DEFAULT_PHONE_COUNTRY_CODE,
      number: "",
      value: "",
    })),
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
    mapQuery: "",
  };
}

export function resetContactDetailsState(): ContactDetailsState {
  const cleared = getEmptyContactDetailsState();
  saveContactDetailsState(cleared);
  return cleared;
}

export function resolveContactMapQuery(state: ContactDetailsState): string {
  return state.mapQuery?.trim() || formatAddress(state.address);
}
