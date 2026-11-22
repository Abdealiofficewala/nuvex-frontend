import { assignFieldError, isFormValid, validateRequiredText } from "@/lib/validations/common";
import type { AdminUserPageAccess } from "@/lib/admin-page-access.config";

export type AdminRoleField = "name" | "description";

export type AdminRoleFormValues = {
  name: string;
  description: string;
  active: boolean;
  permissions: AdminUserPageAccess;
};

export type AdminRoleErrorKey = "required";

export type AdminRoleFormErrors = Partial<Record<AdminRoleField, AdminRoleErrorKey>>;

export function validateAdminRoleForm(values: Pick<AdminRoleFormValues, "name">): AdminRoleFormErrors {
  const errors: AdminRoleFormErrors = {};
  assignFieldError(errors, "name", validateRequiredText(values.name));
  return errors;
}

export function isAdminRoleFormValid(errors: AdminRoleFormErrors) {
  return isFormValid(errors);
}
