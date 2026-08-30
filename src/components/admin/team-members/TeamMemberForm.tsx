"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import {
  AdminFormField,
  AdminFormSelect,
  AdminFormTextarea,
  AdminImageUpload,
  AdminPhoneField,
} from "@/components/admin/common";
import { Button, ButtonLink } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { ROUTES, teamMemberViewHref } from "@/lib/constants";
import { TEAM_MEMBER_IMAGE_UPLOAD_CONSTRAINTS } from "@/lib/image-upload.config";
import { buildAdminImageUploadErrors, buildAdminImageUploadLabels } from "@/lib/admin-image-upload-labels";
import { DEFAULT_PHONE_COUNTRY_CODE } from "@/lib/phone-countries.config";
import {
  addTeamMember,
  findTeamMemberById,
  normalizeTeamMemberKey,
  updateTeamMember,
} from "@/lib/team-members";
import { getTeamRolesState, TEAM_ROLES_UPDATED_EVENT } from "@/lib/team-roles";
import {
  isTeamMemberFormValid,
  validateTeamMemberForm,
  type TeamMemberErrorKey,
  type TeamMemberField,
  type TeamMemberFormErrors,
  type TeamMemberFormValues,
} from "@/lib/validations/team-members";
import { formatPhoneParts, parsePhoneParts } from "@/lib/utils/phone";

const emptyValues: TeamMemberFormValues = {
  name: "",
  role: "",
  crunch: "",
  body: "",
  phoneCountryCode: DEFAULT_PHONE_COUNTRY_CODE,
  phoneNumber: "",
  email: "",
  image: "",
  visible: true,
};

type TeamMemberFormProps = {
  editId?: string;
};

export function TeamMemberForm({ editId }: TeamMemberFormProps) {
  const isEdit = Boolean(editId);
  const originalKey = normalizeTeamMemberKey(editId ?? "");
  const t = useTranslations(
    isEdit ? "admin.company.teams.edit" : "admin.company.teams.create",
  );
  const teamsT = useTranslations("admin.company.teams");
  const toast = useToast();
  const router = useRouter();
  const nameId = useId();
  const roleId = useId();
  const crunchId = useId();
  const bodyId = useId();
  const phoneId = useId();
  const emailId = useId();
  const imageId = useId();
  const visibleId = useId();
  const [values, setValues] = useState<TeamMemberFormValues>(emptyValues);
  const [roles, setRoles] = useState<{ label: string; value: string }[]>([]);
  const [extraErrors, setExtraErrors] = useState<TeamMemberFormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Partial<Record<TeamMemberField, boolean>>>({});
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(!isEdit);

  useEffect(() => {
    const syncRoles = () => {
      setRoles(getTeamRolesState().map((role) => ({ label: role.label, value: role.label })));
    };

    syncRoles();
    window.addEventListener(TEAM_ROLES_UPDATED_EVENT, syncRoles);
    return () => window.removeEventListener(TEAM_ROLES_UPDATED_EVENT, syncRoles);
  }, []);

  useEffect(() => {
    if (!isEdit) {
      return;
    }

    const member = findTeamMemberById(originalKey);
    if (member) {
      const phone = parsePhoneParts(member.phone);
      setValues({
        name: member.name,
        role: member.role,
        crunch: member.crunch,
        body: member.body,
        phoneCountryCode: phone.countryCode,
        phoneNumber: phone.number,
        email: member.email,
        image: member.image,
        visible: member.visible,
      });
    }

    setLoaded(true);
  }, [isEdit, originalKey]);

  const validationErrors = validateTeamMemberForm(values);
  const fieldErrors = { ...validationErrors, ...extraErrors };
  const canSave = loaded && isTeamMemberFormValid(fieldErrors);

  const roleOptions = useMemo(() => {
    if (!values.role || roles.some((role) => role.label === values.role)) {
      return roles;
    }

    return [{ label: values.role, value: values.role }, ...roles];
  }, [roles, values.role]);

  const visibleOptions = useMemo(
    () => [
      { label: teamsT("options.yes"), value: "yes" },
      { label: teamsT("options.no"), value: "no" },
    ],
    [teamsT],
  );

  function touchField(field: TeamMemberField) {
    setTouchedFields((current) => ({ ...current, [field]: true }));
  }

  function touchAllFields() {
    setTouchedFields({
      name: true,
      role: true,
      crunch: true,
      body: true,
      phone: true,
      email: true,
      image: true,
    });
  }

  function getVisibleFieldError(field: TeamMemberField): TeamMemberErrorKey | undefined {
    if (!touchedFields[field]) {
      return undefined;
    }

    return fieldErrors[field];
  }

  function getFieldErrorMessage(errorKey: string) {
    return t(`errors.${errorKey as TeamMemberErrorKey}`);
  }

  function clearFieldExtraError(field: TeamMemberField) {
    setExtraErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function updateField<K extends keyof TeamMemberFormValues>(
    field: K,
    nextValue: TeamMemberFormValues[K],
    touchKey?: TeamMemberField,
  ) {
    if (touchKey) {
      touchField(touchKey);
      clearFieldExtraError(touchKey);
    }

    setValues((current) => ({ ...current, [field]: nextValue }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    touchAllFields();
    setExtraErrors({});

    const submitErrors = validateTeamMemberForm(values);
    if (!isTeamMemberFormValid(submitErrors)) {
      toast.error(t("errors.title"), t("errors.validation"));
      return;
    }

    setSaving(true);

    const payload = {
      name: values.name.trim(),
      role: values.role.trim(),
      crunch: values.crunch.trim(),
      body: values.body.trim(),
      phone: formatPhoneParts(values.phoneCountryCode, values.phoneNumber),
      email: values.email.trim().toLowerCase(),
      image: values.image.trim(),
      visible: values.visible,
    };

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 320));

      if (isEdit) {
        const nextState = updateTeamMember(originalKey, payload);
        const updated = nextState.find((item) => item.key === originalKey);
        toast.success(t("success.title"), t("success.body"));
        router.push(updated ? teamMemberViewHref(updated.key) : ROUTES.admin.teamMembers.members);
        return;
      }

      addTeamMember(payload);
      toast.success(t("success.title"), t("success.body"));
      router.push(ROUTES.admin.teamMembers.members);
    } catch (error) {
      if (isEdit && error instanceof Error && error.message === "not-found") {
        toast.error(t("errors.title"), t("errors.notFound"));
        router.push(ROUTES.admin.teamMembers.members);
        return;
      }

      toast.error(t("errors.title"), t("errors.generic"));
    } finally {
      setSaving(false);
    }
  }

  if (isEdit && loaded && !findTeamMemberById(originalKey)) {
    return (
      <div className="admin-role-view admin-role-view--empty">
        <p className="admin-role-view__empty-title">{t("notFound.title")}</p>
        <p className="admin-role-view__empty-body">{t("notFound.body")}</p>
        <ButtonLink href={ROUTES.admin.teamMembers.members} variant="secondary">
          {t("cancelAction")}
        </ButtonLink>
      </div>
    );
  }

  const cancelHref = ROUTES.admin.teamMembers.members;
  const disabled = saving || !loaded;

  return (
    <form className="admin-member-form admin-create-form" onSubmit={onSubmit} noValidate>
      <div className="admin-panel admin-member-form__panel">
        <div className="admin-member-form__body">
          <section className="admin-member-form__section admin-member-form__section--profile">
            <div className="admin-member-form__profile">
              <div className="admin-member-form__media">
                <AdminImageUpload
                  id={imageId}
                  label={t("fields.image")}
                  required
                  value={values.image}
                  constraints={TEAM_MEMBER_IMAGE_UPLOAD_CONSTRAINTS}
                  onChange={(nextImage) => updateField("image", nextImage, "image")}
                  onBlur={() => touchField("image")}
                  disabled={disabled}
                  fieldError={getVisibleFieldError("image")}
                  getErrorMessage={getFieldErrorMessage}
                  labels={buildAdminImageUploadLabels((key) => t(`image.${key}`))}
                  uploadErrorMessages={buildAdminImageUploadErrors((key) => t(`image.${key}`))}
                />
              </div>

              <div className="admin-member-form__details admin-form-grid admin-form-grid--2">
                <AdminFormField
                  id={nameId}
                  label={t("fields.name")}
                  required
                  fieldError={getVisibleFieldError("name")}
                  getErrorMessage={getFieldErrorMessage}
                  value={values.name}
                  onChange={(event) => updateField("name", event.target.value, "name")}
                  onBlur={() => touchField("name")}
                  placeholder={t("placeholders.name")}
                  disabled={disabled}
                  autoComplete="name"
                />

                <AdminFormSelect
                  id={roleId}
                  label={t("fields.role")}
                  required
                  value={values.role}
                  placeholder={t("placeholders.role")}
                  options={roleOptions}
                  fieldError={getVisibleFieldError("role")}
                  getErrorMessage={getFieldErrorMessage}
                  onChange={(nextRole) => updateField("role", nextRole, "role")}
                  onBlur={() => touchField("role")}
                  disabled={disabled}
                />

                <AdminPhoneField
                  id={phoneId}
                  label={t("fields.phone")}
                  countryCode={values.phoneCountryCode}
                  number={values.phoneNumber}
                  placeholder={t("placeholders.phone")}
                  disabled={disabled}
                  error={
                    getVisibleFieldError("phone")
                      ? getFieldErrorMessage(getVisibleFieldError("phone")!)
                      : undefined
                  }
                  onCountryChange={(countryCode) => {
                    touchField("phone");
                    clearFieldExtraError("phone");
                    updateField("phoneCountryCode", countryCode);
                  }}
                  onNumberChange={(number) => {
                    touchField("phone");
                    clearFieldExtraError("phone");
                    updateField("phoneNumber", number);
                  }}
                  onBlur={() => touchField("phone")}
                />

                <AdminFormField
                  id={emailId}
                  label={t("fields.email")}
                  required
                  type="email"
                  inputMode="email"
                  fieldError={getVisibleFieldError("email")}
                  getErrorMessage={getFieldErrorMessage}
                  value={values.email}
                  onChange={(event) => updateField("email", event.target.value, "email")}
                  onBlur={() => touchField("email")}
                  placeholder={t("placeholders.email")}
                  disabled={disabled}
                  autoComplete="email"
                />

                <AdminFormField
                  id={crunchId}
                  label={t("fields.crunch")}
                  required
                  className="admin-member-form__tagline admin-form-grid__full"
                  fieldError={getVisibleFieldError("crunch")}
                  getErrorMessage={getFieldErrorMessage}
                  value={values.crunch}
                  onChange={(event) => updateField("crunch", event.target.value, "crunch")}
                  onBlur={() => touchField("crunch")}
                  placeholder={t("placeholders.crunch")}
                  disabled={disabled}
                  autoComplete="off"
                />

                {isEdit ? (
                  <AdminFormSelect
                    id={visibleId}
                    label={t("fields.visible")}
                    value={values.visible ? "yes" : "no"}
                    options={visibleOptions}
                    onChange={(nextValue) => updateField("visible", nextValue === "yes")}
                    disabled={disabled}
                    className="admin-member-form__visibility admin-form-grid__full"
                  />
                ) : null}
              </div>
            </div>
          </section>

          <section className="admin-member-form__section admin-member-form__section--body">
            <AdminFormTextarea
              id={bodyId}
              label={t("fields.body")}
              required
              rows={5}
              fieldError={getVisibleFieldError("body")}
              getErrorMessage={getFieldErrorMessage}
              value={values.body}
              onChange={(event) => updateField("body", event.target.value, "body")}
              onBlur={() => touchField("body")}
              placeholder={t("placeholders.body")}
              disabled={disabled}
            />
          </section>
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
