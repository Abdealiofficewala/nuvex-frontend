import { ADMIN_AUTH } from "@/lib/constants";
import {
  isFormValid,
  validateMinLength,
  validateRequiredEmail,
  validateRequiredText,
} from "@/lib/validations/common";

export type AdminLoginErrorKey =
  | "errors.emailRequired"
  | "errors.emailInvalid"
  | "errors.passwordRequired"
  | "errors.passwordShort"
  | "errors.invalidCredentials"
  | "errors.generic";

export type AdminLoginField = "email" | "password";

export type AdminLoginFormErrors = Partial<Record<AdminLoginField, AdminLoginErrorKey>>;

export type AdminLoginValues = {
  email: string;
  password: string;
};

function mapEmailError(error: "required" | "invalidEmail" | undefined): AdminLoginErrorKey | undefined {
  if (error === "required") {
    return "errors.emailRequired";
  }

  if (error === "invalidEmail") {
    return "errors.emailInvalid";
  }

  return undefined;
}

export function validateAdminLoginForm(values: AdminLoginValues): AdminLoginFormErrors {
  const errors: AdminLoginFormErrors = {};
  const email = values.email?.trim() ?? "";
  const password = values.password ?? "";

  const emailError = mapEmailError(validateRequiredEmail(email));
  if (emailError) {
    errors.email = emailError;
  }

  const passwordRequired = validateRequiredText(password);
  if (passwordRequired) {
    errors.password = "errors.passwordRequired";
  } else if (validateMinLength(password, ADMIN_AUTH.minPasswordLength)) {
    errors.password = "errors.passwordShort";
  }

  return errors;
}

export function isAdminLoginFormValid(errors: AdminLoginFormErrors): boolean {
  return isFormValid(errors);
}

export function verifyAdminCredentials(values: AdminLoginValues): boolean {
  if (ADMIN_AUTH.mockSignIn) {
    return isAdminLoginFormValid(validateAdminLoginForm(values));
  }

  const email = values.email?.trim().toLowerCase() ?? "";
  const password = values.password ?? "";

  return email === ADMIN_AUTH.demoEmail.toLowerCase() && password === ADMIN_AUTH.demoPassword;
}
