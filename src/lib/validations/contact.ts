import type { CreateContactMessageInput } from "@/types/message";
import {
  isFormValid,
  validateMinLength,
  validateRequiredEmail,
  validateRequiredText,
} from "@/lib/validations/common";

export type ContactErrorKey = "errors.nameRequired" | "errors.emailInvalid" | "errors.messageShort";

export type ContactFormErrors = Partial<Record<keyof CreateContactMessageInput, ContactErrorKey>>;

export function validateContactForm(values: CreateContactMessageInput): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (validateRequiredText(values.name ?? "")) {
    errors.name = "errors.nameRequired";
  }

  const emailError = validateRequiredEmail(values.email ?? "");
  if (emailError === "required" || emailError === "invalidEmail") {
    errors.email = "errors.emailInvalid";
  }

  if (validateRequiredText(values.message ?? "") || validateMinLength(values.message ?? "", 5)) {
    errors.message = "errors.messageShort";
  }

  return errors;
}

export function isContactFormValid(errors: ContactFormErrors): boolean {
  return isFormValid(errors);
}
