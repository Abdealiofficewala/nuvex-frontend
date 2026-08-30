import {
  assignFieldError,
  isFormValid,
  validateMinLength,
  validateRequiredEmail,
  validateRequiredPhone,
  validateRequiredText,
} from "@/lib/validations/common";

export type TeamMemberField =
  | "name"
  | "role"
  | "crunch"
  | "body"
  | "phone"
  | "email"
  | "image";

export type TeamMemberErrorKey =
  | "required"
  | "tooShort"
  | "invalidEmail"
  | "invalidPhone";

export type TeamMemberFormValues = {
  name: string;
  role: string;
  crunch: string;
  body: string;
  phoneCountryCode: string;
  phoneNumber: string;
  email: string;
  image: string;
  visible: boolean;
};

export type TeamMemberFormErrors = Partial<Record<TeamMemberField, TeamMemberErrorKey>>;

function validateRequiredMinText(value: string, min: number): TeamMemberErrorKey | undefined {
  const requiredError = validateRequiredText(value);
  if (requiredError) {
    return requiredError;
  }

  return validateMinLength(value, min);
}

function validateImage(value: string): TeamMemberErrorKey | undefined {
  return validateRequiredText(value);
}

export function validateTeamMemberForm(values: TeamMemberFormValues): TeamMemberFormErrors {
  const errors: TeamMemberFormErrors = {};

  assignFieldError(errors, "name", validateRequiredMinText(values.name, 2));
  assignFieldError(errors, "role", validateRequiredText(values.role));
  assignFieldError(errors, "crunch", validateRequiredMinText(values.crunch, 2));
  assignFieldError(errors, "body", validateRequiredMinText(values.body, 10));
  assignFieldError(
    errors,
    "phone",
    validateRequiredPhone(values.phoneCountryCode, values.phoneNumber),
  );
  assignFieldError(errors, "email", validateRequiredEmail(values.email));
  assignFieldError(errors, "image", validateImage(values.image));

  return errors;
}

export function isTeamMemberFormValid(errors: TeamMemberFormErrors): boolean {
  return isFormValid(errors);
}
