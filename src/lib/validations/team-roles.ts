import { TEAM_ROLE_VALUE_PATTERN } from "@/lib/team-roles.config";
import { findTeamRoleByValue, normalizeTeamRoleValue } from "@/lib/team-roles";
import {
  assignFieldError,
  hasValue,
  isFormValid,
  validateMinLength,
  validateRequiredText,
} from "@/lib/validations/common";

export type TeamRoleField = "label" | "value";

export type TeamRoleErrorKey = "required" | "tooShort" | "invalidValue" | "duplicate";

export type TeamRoleFormValues = {
  label: string;
  value: string;
};

export type TeamRoleFormErrors = Partial<Record<TeamRoleField, TeamRoleErrorKey>>;

function validateRoleValue(value: string, excludeValue?: string): TeamRoleErrorKey | undefined {
  const requiredError = validateRequiredText(value);
  if (requiredError) {
    return requiredError;
  }

  const minError = validateMinLength(value, 2);
  if (minError) {
    return minError;
  }

  const normalized = normalizeTeamRoleValue(value);
  if (!TEAM_ROLE_VALUE_PATTERN.test(normalized)) {
    return "invalidValue";
  }

  const existing = findTeamRoleByValue(normalized);
  if (existing && normalizeTeamRoleValue(excludeValue ?? "") !== normalized) {
    return "duplicate";
  }

  return undefined;
}

function validateRoleLabel(label: string): TeamRoleErrorKey | undefined {
  const requiredError = validateRequiredText(label);
  if (requiredError) {
    return requiredError;
  }

  return validateMinLength(label, 2);
}

export function validateTeamRoleForm(
  values: TeamRoleFormValues,
  options?: { excludeValue?: string },
): TeamRoleFormErrors {
  const errors: TeamRoleFormErrors = {};

  assignFieldError(errors, "label", validateRoleLabel(values.label));
  assignFieldError(errors, "value", validateRoleValue(values.value, options?.excludeValue));

  return errors;
}

export function isTeamRoleFormValid(errors: TeamRoleFormErrors): boolean {
  return isFormValid(errors);
}

export function isTeamRoleLabelValid(label: string): boolean {
  return hasValue(label);
}
