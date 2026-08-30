import type { ContactAddress, ContactDetailsState } from "@/lib/contact-details.config";
import {
  assignFieldError,
  isFormValid,
  validateRequiredPhone,
  validateRequiredEmail,
  validateRequiredText,
} from "@/lib/validations/common";

export type ContactDetailsField =
  | "person"
  | "email"
  | "mobile"
  | "whatsapp"
  | "mapQuery"
  | keyof ContactAddress;

export type ContactDetailsErrorKey = "required" | "invalidEmail" | "invalidPhone";

export type ContactDetailsFormErrors = Partial<Record<ContactDetailsField, ContactDetailsErrorKey>>;

export const CONTACT_DETAILS_FIELDS: ContactDetailsField[] = [
  "person",
  "email",
  "mobile",
  "whatsapp",
  "street",
  "city",
  "state",
  "country",
  "postalCode",
  "mapQuery",
];

export function touchAllContactDetailsFields(): Partial<Record<ContactDetailsField, boolean>> {
  return CONTACT_DETAILS_FIELDS.reduce(
    (acc, field) => {
      acc[field] = true;
      return acc;
    },
    {} as Partial<Record<ContactDetailsField, boolean>>,
  );
}

export function validateContactDetailsForm(state: ContactDetailsState): ContactDetailsFormErrors {
  const errors: ContactDetailsFormErrors = {};
  const mobile = state.phones.find((item) => item.key === "mobile");
  const whatsapp = state.phones.find((item) => item.key === "whatsapp");

  assignFieldError(errors, "person", validateRequiredText(state.person));
  assignFieldError(errors, "email", validateRequiredEmail(state.email));
  assignFieldError(
    errors,
    "mobile",
    validateRequiredPhone(mobile?.countryCode ?? "", mobile?.number ?? ""),
  );
  assignFieldError(
    errors,
    "whatsapp",
    validateRequiredPhone(whatsapp?.countryCode ?? "", whatsapp?.number ?? ""),
  );
  assignFieldError(errors, "street", validateRequiredText(state.address.street));
  assignFieldError(errors, "city", validateRequiredText(state.address.city));
  assignFieldError(errors, "state", validateRequiredText(state.address.state));
  assignFieldError(errors, "country", validateRequiredText(state.address.country));
  assignFieldError(errors, "mapQuery", validateRequiredText(state.mapQuery));

  return errors;
}

export function isContactDetailsFormValid(errors: ContactDetailsFormErrors) {
  return isFormValid(errors);
}
