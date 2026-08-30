import {
  DEFAULT_PHONE_COUNTRY_CODE,
  PHONE_COUNTRY_OPTIONS,
} from "@/lib/phone-countries.config";
import { isValidPhoneNumber } from "@/lib/validations/common";

export function parsePhoneParts(raw: string): { countryCode: string; number: string } {
  const trimmed = raw?.trim() ?? "";

  if (!trimmed) {
    return { countryCode: DEFAULT_PHONE_COUNTRY_CODE, number: "" };
  }

  const dialCodes = [...PHONE_COUNTRY_OPTIONS]
    .map((item) => item.dial)
    .sort((a, b) => b.length - a.length);

  for (const dial of dialCodes) {
    if (trimmed.startsWith(dial)) {
      return {
        countryCode: dial,
        number: trimmed.slice(dial.length).replace(/[^\d]/g, ""),
      };
    }
  }

  const digits = trimmed.replace(/[^\d+]/g, "");
  const generic = digits.match(/^(\+\d{1,4})(\d+)$/);

  if (generic) {
    return {
      countryCode: generic[1],
      number: generic[2],
    };
  }

  return {
    countryCode: DEFAULT_PHONE_COUNTRY_CODE,
    number: trimmed.replace(/[^\d]/g, ""),
  };
}

export function formatPhoneParts(countryCode: string, number: string): string {
  const dial = countryCode?.trim() || DEFAULT_PHONE_COUNTRY_CODE;
  const local = number.replace(/[^\d]/g, "");

  if (!local) {
    return "";
  }

  return `${dial} ${local}`;
}

export function isValidPhoneParts(countryCode: string, number: string): boolean {
  return isValidPhoneNumber(countryCode, number);
}

export function sanitizePhoneNumberInput(value: string): string {
  return value.replace(/[^\d]/g, "").slice(0, 14);
}
