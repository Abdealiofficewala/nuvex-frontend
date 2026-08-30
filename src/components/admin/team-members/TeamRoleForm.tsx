"use client";

import { useEffect, useId, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { AdminFormField } from "@/components/admin/common/AdminFormField";
import { Button, ButtonLink } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { ROUTES, teamRoleViewHref } from "@/lib/constants";
import {
  addTeamRole,
  findTeamRoleByValue,
  normalizeTeamRoleValue,
  updateTeamRole,
} from "@/lib/team-roles";
import {
  isTeamRoleFormValid,
  validateTeamRoleForm,
  type TeamRoleField,
  type TeamRoleErrorKey,
  type TeamRoleFormErrors,
} from "@/lib/validations/team-roles";

type TeamRoleFormProps = {
  editValue?: string;
};

export function TeamRoleForm({ editValue }: TeamRoleFormProps) {
  const isEdit = Boolean(editValue);
  const originalValue = normalizeTeamRoleValue(editValue ?? "");
  const t = useTranslations(
    isEdit ? "admin.company.teamMembers.roles.edit" : "admin.company.teamMembers.roles.create",
  );
  const toast = useToast();
  const router = useRouter();
  const roleTitleId = useId();
  const roleKeyId = useId();
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [extraErrors, setExtraErrors] = useState<TeamRoleFormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Partial<Record<TeamRoleField, boolean>>>({});
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(!isEdit);

  useEffect(() => {
    if (!isEdit) {
      return;
    }

    const role = findTeamRoleByValue(originalValue);
    if (role) {
      setLabel(role.label);
      setValue(role.value);
    }

    setLoaded(true);
  }, [isEdit, originalValue]);

  const validationOptions = isEdit ? { excludeValue: originalValue } : undefined;
  const validationErrors = validateTeamRoleForm({ label, value }, validationOptions);
  const fieldErrors = { ...validationErrors, ...extraErrors };
  const canSave = loaded && isTeamRoleFormValid(fieldErrors);

  function touchField(field: TeamRoleField) {
    setTouchedFields((current) => ({ ...current, [field]: true }));
  }

  function touchAllFields() {
    setTouchedFields({ label: true, value: true });
  }

  function getVisibleFieldError(field: TeamRoleField): TeamRoleErrorKey | undefined {
    if (!touchedFields[field]) {
      return undefined;
    }

    return fieldErrors[field];
  }

  function getFieldErrorMessage(errorKey: string) {
    return t(`errors.${errorKey as TeamRoleErrorKey}`);
  }

  function clearFieldExtraError(field: TeamRoleField) {
    setExtraErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function updateLabel(nextLabel: string) {
    touchField("label");
    clearFieldExtraError("label");
    setLabel(nextLabel);
  }

  function updateValue(nextValue: string) {
    touchField("value");
    clearFieldExtraError("value");
    setValue(normalizeTeamRoleValue(nextValue));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    touchAllFields();
    setExtraErrors({});

    const submitErrors = validateTeamRoleForm({ label, value }, validationOptions);
    if (!isTeamRoleFormValid(submitErrors)) {
      toast.error(t("errors.title"), t("errors.validation"));
      return;
    }

    setSaving(true);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 320));

      if (isEdit) {
        const nextState = updateTeamRole(originalValue, {
          label: label.trim(),
          value: normalizeTeamRoleValue(value),
        });
        const updated = nextState.find((item) => item.value === normalizeTeamRoleValue(value));
        toast.success(t("success.title"), t("success.body"));
        router.push(updated ? teamRoleViewHref(updated.value) : ROUTES.admin.teamMembers.roles);
        return;
      }

      addTeamRole({ label: label.trim(), value: normalizeTeamRoleValue(value) });
      toast.success(t("success.title"), t("success.body"));
      router.push(ROUTES.admin.teamMembers.roles);
    } catch (error) {
      if (error instanceof Error && error.message === "duplicate") {
        setExtraErrors({ value: "duplicate" });
        toast.error(t("errors.title"), t("errors.duplicate"));
        return;
      }

      if (isEdit && error instanceof Error && error.message === "not-found") {
        toast.error(t("errors.title"), t("errors.notFound"));
        router.push(ROUTES.admin.teamMembers.roles);
        return;
      }

      toast.error(t("errors.title"), t("errors.generic"));
    } finally {
      setSaving(false);
    }
  }

  if (isEdit && loaded && !findTeamRoleByValue(originalValue)) {
    return (
      <div className="admin-role-view admin-role-view--empty">
        <p className="admin-role-view__empty-title">{t("notFound.title")}</p>
        <p className="admin-role-view__empty-body">{t("notFound.body")}</p>
        <ButtonLink href={ROUTES.admin.teamMembers.roles} variant="secondary">
          {t("backAction")}
        </ButtonLink>
      </div>
    );
  }

  const cancelHref = ROUTES.admin.teamMembers.roles;

  return (
    <form className="admin-role-form admin-create-form" onSubmit={onSubmit} noValidate>
      <div className="admin-panel admin-role-form__panel">
        <div className="admin-role-form__body admin-form-grid admin-form-grid--2">
          <AdminFormField
            id={roleTitleId}
            label={t("fields.roleTitle")}
            required
            fieldError={getVisibleFieldError("label")}
            getErrorMessage={getFieldErrorMessage}
            value={label}
            onChange={(event) => updateLabel(event.target.value)}
            onBlur={() => touchField("label")}
            placeholder={t("placeholders.roleTitle")}
            disabled={saving || !loaded}
            autoComplete="off"
          />

          <AdminFormField
            id={roleKeyId}
            label={t("fields.roleKey")}
            required
            fieldError={getVisibleFieldError("value")}
            getErrorMessage={getFieldErrorMessage}
            value={value}
            onChange={(event) => updateValue(event.target.value)}
            onBlur={() => touchField("value")}
            placeholder={t("placeholders.roleKey")}
            disabled={saving || !loaded}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="admin-page-actions admin-page-actions--form">
          <Button
            type="button"
            variant="secondary"
            className="admin-page-actions__btn admin-page-actions__btn--reset"
            disabled={saving}
            onClick={() => router.push(cancelHref)}
          >
            {t("cancelAction")}
          </Button>
          <Button
            type="submit"
            variant="accent"
            className="admin-page-actions__btn admin-page-actions__btn--save"
            disabled={saving || !canSave}
          >
            {saving ? t("saving") : t("save")}
          </Button>
        </div>
      </div>
    </form>
  );
}
