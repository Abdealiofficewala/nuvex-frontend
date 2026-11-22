import {
  assignFieldError,
  isFormValid,
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

export type CreateUserField = AdminUserProfileField | "roleId" | "active";

export type CreateUserValues = AdminUserProfileValues & {
  roleId: string;
  active: boolean;
};

export type CreateUserErrorKey = AdminUserProfileErrorKey | "roleRequired";

export type CreateUserFormErrors = Partial<Record<CreateUserField, CreateUserErrorKey>>;

export function validateCreateUserForm(values: CreateUserValues): CreateUserFormErrors {
  const errors: CreateUserFormErrors = {
    ...validateAdminUserProfileForm(values),
  };

  if (!values.roleId.trim()) {
    errors.roleId = "roleRequired";
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
