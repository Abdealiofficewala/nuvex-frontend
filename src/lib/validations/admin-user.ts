import { ADMIN_AUTH } from "@/lib/constants";
import {
  assignFieldError,
  isFormValid,
  validateMinLength,
  validateRequiredEmail,
  validateRequiredPhone,
  validateRequiredText,
} from "@/lib/validations/common";
import type { AdminUserAddressField } from "@/lib/admin-users.config";

export type AdminUserProfileField =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "designation"
  | AdminUserAddressField;

export type AdminUserProfileValues = {
  firstName: string;
  lastName: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  image: string;
  designation: string;
  addressLine1: string;
  addressLine2: string;
  village: string;
  city: string;
  pincode: string;
  state: string;
};

export type AdminUserProfileErrorKey = "required" | "invalidEmail" | "invalidPhone";

export type AdminUserProfileFormErrors = Partial<
  Record<AdminUserProfileField, AdminUserProfileErrorKey>
>;

const REQUIRED_ADDRESS_FIELDS: AdminUserAddressField[] = [
  "addressLine1",
  "village",
  "city",
  "pincode",
  "state",
];

export function validateAdminUserProfileForm(
  values: AdminUserProfileValues,
): AdminUserProfileFormErrors {
  const errors: AdminUserProfileFormErrors = {};

  assignFieldError(errors, "firstName", validateRequiredText(values.firstName));
  assignFieldError(errors, "lastName", validateRequiredText(values.lastName));
  assignFieldError(errors, "email", validateRequiredEmail(values.email));
  assignFieldError(
    errors,
    "phone",
    validateRequiredPhone(values.phoneCountryCode, values.phoneNumber),
  );
  assignFieldError(errors, "designation", validateRequiredText(values.designation));

  for (const field of REQUIRED_ADDRESS_FIELDS) {
    assignFieldError(errors, field, validateRequiredText(values[field]));
  }

  return errors;
}

export function isAdminUserProfileFormValid(errors: AdminUserProfileFormErrors) {
  return isFormValid(errors);
}

export type CreateUserField =
  | AdminUserProfileField
  | "password"
  | "confirmPassword"
  | "role"
  | "active";

export type CreateUserValues = AdminUserProfileValues & {
  password: string;
  confirmPassword: string;
  role: "" | "admin" | "editor" | "viewer";
  active: boolean;
};

export type CreateUserErrorKey =
  | AdminUserProfileErrorKey
  | "roleRequired"
  | "passwordRequired"
  | "passwordShort"
  | "confirmRequired"
  | "confirmMismatch";

export type CreateUserFormErrors = Partial<Record<CreateUserField, CreateUserErrorKey>>;

export function validateCreateUserForm(values: CreateUserValues): CreateUserFormErrors {
  const errors: CreateUserFormErrors = {
    ...validateAdminUserProfileForm(values),
  };

  if (validateRequiredText(values.password)) {
    errors.password = "passwordRequired";
  } else if (validateMinLength(values.password, ADMIN_AUTH.minPasswordLength)) {
    errors.password = "passwordShort";
  }

  if (validateRequiredText(values.confirmPassword)) {
    errors.confirmPassword = "confirmRequired";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "confirmMismatch";
  }

  if (!values.role) {
    errors.role = "roleRequired";
  }

  return errors;
}

export function isCreateUserFormValid(errors: CreateUserFormErrors) {
  return isFormValid(errors);
}

export const ADMIN_USER_PROFILE_TOUCH_FIELDS: AdminUserProfileField[] = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "designation",
  "addressLine1",
  "addressLine2",
  "village",
  "city",
  "pincode",
  "state",
];
