import type { CompanyProfileField, CompanyProfileState } from "@/lib/company-profile.config";
import {
  assignFieldError,
  isFormValid,
  validateRequiredEmail,
  validateRequiredPhone,
  validateRequiredText,
} from "@/lib/validations/common";
import { parsePhoneParts } from "@/lib/utils/phone";

export type CompanyProfileErrorKey =
  | "required"
  | "invalidEmail"
  | "invalidPhone"
  | "invalidYear"
  | "tooShort";

export type CompanyProfileFormErrors = Partial<Record<CompanyProfileField, CompanyProfileErrorKey>>;

const DESCRIPTION_MIN_LENGTH = 24;

function validateRequiredPhoneValue(value: string): CompanyProfileErrorKey | undefined {
  const { countryCode, number } = parsePhoneParts(value);
  return validateRequiredPhone(countryCode, number);
}

function validateFoundedYear(value: string): CompanyProfileErrorKey | undefined {
  const requiredError = validateRequiredText(value);
  if (requiredError) {
    return requiredError;
  }

  const trimmed = value.trim();
  if (!/^\d{4}$/.test(trimmed)) {
    return "invalidYear";
  }

  const year = Number.parseInt(trimmed, 10);
  if (year < 1800 || year > 2100) {
    return "invalidYear";
  }

  return undefined;
}

function validateDescription(value: string): CompanyProfileErrorKey | undefined {
  const requiredError = validateRequiredText(value);
  if (requiredError) {
    return requiredError;
  }

  if (value.trim().length < DESCRIPTION_MIN_LENGTH) {
    return "tooShort";
  }

  return undefined;
}

export function validateCompanyProfileForm(state: CompanyProfileState): CompanyProfileFormErrors {
  const errors: CompanyProfileFormErrors = {};

  assignFieldError(errors, "name", validateRequiredText(state.name));
  assignFieldError(errors, "shortName", validateRequiredText(state.shortName));
  assignFieldError(errors, "tagline", validateRequiredText(state.tagline));
  assignFieldError(errors, "description", validateDescription(state.description));
  assignFieldError(errors, "foundedYear", validateFoundedYear(state.foundedYear));
  assignFieldError(errors, "hqCity", validateRequiredText(state.hqCity));
  assignFieldError(errors, "hqState", validateRequiredText(state.hqState));
  assignFieldError(errors, "hqCountry", validateRequiredText(state.hqCountry));
  assignFieldError(errors, "deskAddress", validateRequiredText(state.deskAddress));
  assignFieldError(errors, "productLines", validateRequiredText(state.productLines));
  assignFieldError(errors, "reach", validateRequiredText(state.reach));
  assignFieldError(errors, "email", validateRequiredEmail(state.email));
  assignFieldError(errors, "phone", validateRequiredPhoneValue(state.phone));

  return errors;
}

export function isCompanyProfileFormValid(errors: CompanyProfileFormErrors) {
  return isFormValid(errors);
}
