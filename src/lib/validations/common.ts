import { isValidHttpUrl } from "@/lib/utils/url";

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PHONE_MIN_DIGITS = 8;
export const PHONE_MAX_DIGITS = 14;

export type CommonValidationError =
  | "required"
  | "invalidEmail"
  | "invalidPhone"
  | "invalidUrl"
  | "tooShort";

export function hasValue(value: string | undefined | null): boolean {
  return Boolean(value?.trim());
}

export function isValidEmail(value: string): boolean {
  const email = value?.trim() ?? "";
  return Boolean(email && EMAIL_PATTERN.test(email));
}

export function isValidUrl(value: string): boolean {
  const trimmed = value?.trim() ?? "";
  return Boolean(trimmed && isValidHttpUrl(trimmed));
}

export function isValidPhoneNumber(countryCode: string, number: string): boolean {
  const local = number?.replace(/\D/g, "") ?? "";
  if (!local) {
    return true;
  }

  return Boolean(countryCode?.trim()) && local.length >= PHONE_MIN_DIGITS && local.length <= PHONE_MAX_DIGITS;
}

export function validateRequiredText(value: string): "required" | undefined {
  return hasValue(value) ? undefined : "required";
}

export function validateMinLength(value: string, min: number): "tooShort" | undefined {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) {
    return undefined;
  }

  return trimmed.length >= min ? undefined : "tooShort";
}

export function validateOptionalEmail(value: string): "invalidEmail" | undefined {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) {
    return undefined;
  }

  return isValidEmail(trimmed) ? undefined : "invalidEmail";
}

export function validateRequiredEmail(value: string): "required" | "invalidEmail" | undefined {
  const requiredError = validateRequiredText(value);
  if (requiredError) {
    return requiredError;
  }

  return validateOptionalEmail(value);
}

export function validateOptionalUrl(value: string): "invalidUrl" | undefined {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) {
    return undefined;
  }

  return isValidUrl(trimmed) ? undefined : "invalidUrl";
}

export function validateRequiredUrl(value: string): "required" | "invalidUrl" | undefined {
  const requiredError = validateRequiredText(value);
  if (requiredError) {
    return requiredError;
  }

  return validateOptionalUrl(value);
}

export function validateOptionalPhone(
  countryCode: string,
  number: string,
): "invalidPhone" | undefined {
  const local = number?.trim() ?? "";
  if (!local) {
    return undefined;
  }

  return isValidPhoneNumber(countryCode, local) ? undefined : "invalidPhone";
}

export function validateRequiredPhone(
  countryCode: string,
  number: string,
): "required" | "invalidPhone" | undefined {
  const local = number?.trim() ?? "";
  if (!local) {
    return "required";
  }

  return validateOptionalPhone(countryCode, local);
}

export function hasValidationErrors<T extends object>(errors: Partial<T>): boolean {
  return Object.keys(errors).length > 0;
}

export function shouldShowFieldErrorMessage(error?: string | null): boolean {
  return Boolean(error?.trim());
}

export function isFormValid<T extends object>(errors: Partial<T>): boolean {
  return !hasValidationErrors(errors);
}

export function assignFieldError<T extends object, K extends keyof T>(
  errors: Partial<T>,
  field: K,
  error: T[K] | undefined,
) {
  if (error) {
    errors[field] = error;
  }
}
