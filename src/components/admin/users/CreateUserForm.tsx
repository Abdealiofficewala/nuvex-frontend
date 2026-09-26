"use client";

import { useId, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import {
  AdminFormField,
  AdminFormSelect,
  AdminPhoneField,
  AdminFormImageUpload,
} from "@/components/admin/common";
import { ADMIN_USER_IMAGE_UPLOAD_CONSTRAINTS } from "@/lib/image-upload.config";
import { Button, ButtonLink } from "@/components/ui/buttons";
import { useToast } from "@/components/ui/toast";
import { UserAddressFields } from "@/components/admin/users/UserAddressFields";
import { UserPageAccessFields } from "@/components/admin/users/UserPageAccessFields";
import { ADMIN_AUTH, ROUTES } from "@/lib/constants";
import { getNewUserPageAccess, ADMIN_USER_ROLES, saveAdminUser, type AdminUserPageAccess } from "@/lib/admin-users";
import { DEFAULT_PHONE_COUNTRY_CODE } from "@/lib/phone-countries.config";
import {
  ADMIN_USER_PROFILE_TOUCH_FIELDS,
  isCreateUserFormValid,
  validateCreateUserForm,
  type CreateUserErrorKey,
  type CreateUserField,
  type CreateUserValues,
} from "@/lib/validations/admin-user";

const initialValues: CreateUserValues = {
  firstName: "",
  lastName: "",
  email: "",
  phoneCountryCode: DEFAULT_PHONE_COUNTRY_CODE,
  phoneNumber: "",
  image: "",
  designation: "",
  addressLine1: "",
  addressLine2: "",
  village: "",
  city: "",
  pincode: "",
  state: "",
  password: "",
  confirmPassword: "",
  role: "",
  active: true,
};

export function CreateUserForm() {
  const t = useTranslations("admin.users.create");
  const accessT = useTranslations("admin.users.access");
  const toast = useToast();
  const router = useRouter();
  const firstNameId = useId();
  const lastNameId = useId();
  const emailId = useId();
  const designationId = useId();
  const roleId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();
  const imageId = useId();
  const [values, setValues] = useState<CreateUserValues>(initialValues);
  const [pageAccess, setPageAccess] = useState<AdminUserPageAccess>(() => getNewUserPageAccess());
  const [touchedFields, setTouchedFields] = useState<Partial<Record<CreateUserField, boolean>>>({});
  const [saving, setSaving] = useState(false);

  const fieldErrors = validateCreateUserForm(values);
  const canSave = isCreateUserFormValid(fieldErrors);

  const roleOptions = useMemo(
    () =>
      ADMIN_USER_ROLES.map((role) => ({
        label: t(`roles.${role}.title`),
        value: role,
      })),
    [t],
  );

  function touchField(field: CreateUserField) {
    setTouchedFields((current) => ({ ...current, [field]: true }));
  }

  function touchAllFields() {
    setTouchedFields(
      [...ADMIN_USER_PROFILE_TOUCH_FIELDS, "password", "confirmPassword", "role"].reduce(
        (acc, field) => {
          acc[field as CreateUserField] = true;
          return acc;
        },
        {} as Partial<Record<CreateUserField, boolean>>,
      ),
    );
  }

  function getVisibleFieldError(field: CreateUserField): CreateUserErrorKey | undefined {
    if (!touchedFields[field]) {
      return undefined;
    }

    return fieldErrors[field];
  }

  function getFieldErrorMessage(errorKey: string) {
    if (errorKey === "passwordShort") {
      return t(`errors.${errorKey}`, { min: ADMIN_AUTH.minPasswordLength });
    }

    return t(`errors.${errorKey as CreateUserErrorKey}`);
  }

  function updateField<K extends keyof CreateUserValues>(field: K, value: CreateUserValues[K]) {
    if (field !== "active" && field !== "image") {
      touchField(field as CreateUserField);
    }

    setValues((current) => ({ ...current, [field]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    touchAllFields();

    if (!canSave) {
      toast.error(t("errors.title"), t("errors.validation"));
      return;
    }

    const role = values.role;
    if (!role) {
      return;
    }

    setSaving(true);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 420));

      saveAdminUser(
        {
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email: values.email.trim().toLowerCase(),
          phoneCountryCode: values.phoneCountryCode,
          phoneNumber: values.phoneNumber,
          image: values.image,
          designation: values.designation.trim(),
          addressLine1: values.addressLine1.trim(),
          addressLine2: values.addressLine2.trim(),
          village: values.village.trim(),
          city: values.city.trim(),
          pincode: values.pincode.trim(),
          state: values.state.trim(),
          role,
          active: values.active,
        },
        pageAccess,
      );

      toast.success(t("success.title"), t("success.body"));
      router.push(ROUTES.admin.users.root);
    } catch {
      toast.error(t("errors.title"), t("errors.generic"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="admin-member-form admin-create-form" onSubmit={onSubmit} noValidate>
      <div className="admin-panel admin-member-form__panel">
        <div className="admin-member-form__body">
          <section className="admin-member-form__section admin-member-form__section--profile">
            <div className="admin-member-form__profile">
              <div className="admin-member-form__media">
                <AdminFormImageUpload
                  id={imageId}
                  label={t("fields.image")}
                  variant="icon"
                  constraints={ADMIN_USER_IMAGE_UPLOAD_CONSTRAINTS}
                  value={values.image}
                  disabled={saving}
                  onChange={(image) => updateField("image", image)}
                />
              </div>

              <div className="admin-member-form__details admin-form-grid admin-form-grid--2">
                <AdminFormField
                  id={firstNameId}
                  label={t("fields.firstName")}
                  required
                  value={values.firstName}
                  placeholder={t("placeholders.firstName")}
                  disabled={saving}
                  fieldError={getVisibleFieldError("firstName")}
                  getErrorMessage={getFieldErrorMessage}
                  onChange={(event) => updateField("firstName", event.target.value)}
                  onBlur={() => touchField("firstName")}
                  autoComplete="given-name"
                />

                <AdminFormField
                  id={lastNameId}
                  label={t("fields.lastName")}
                  required
                  value={values.lastName}
                  placeholder={t("placeholders.lastName")}
                  disabled={saving}
                  fieldError={getVisibleFieldError("lastName")}
                  getErrorMessage={getFieldErrorMessage}
                  onChange={(event) => updateField("lastName", event.target.value)}
                  onBlur={() => touchField("lastName")}
                  autoComplete="family-name"
                />

                <AdminFormField
                  id={emailId}
                  label={t("fields.email")}
                  required
                  type="email"
                  inputMode="email"
                  value={values.email}
                  placeholder={t("placeholders.email")}
                  disabled={saving}
                  fieldError={getVisibleFieldError("email")}
                  getErrorMessage={getFieldErrorMessage}
                  onChange={(event) => updateField("email", event.target.value)}
                  onBlur={() => touchField("email")}
                  autoComplete="email"
                />

                <AdminPhoneField
                  id="create-user-phone"
                  label={t("fields.phone")}
                  required
                  countryCode={values.phoneCountryCode}
                  number={values.phoneNumber}
                  placeholder={t("placeholders.phone")}
                  disabled={saving}
                  error={
                    getVisibleFieldError("phone")
                      ? getFieldErrorMessage(getVisibleFieldError("phone")!)
                      : undefined
                  }
                  onCountryChange={(countryCode) => updateField("phoneCountryCode", countryCode)}
                  onNumberChange={(number) => updateField("phoneNumber", number)}
                  onBlur={() => touchField("phone")}
                />

                <AdminFormField
                  id={designationId}
                  label={t("fields.designation")}
                  required
                  value={values.designation}
                  placeholder={t("placeholders.designation")}
                  disabled={saving}
                  fieldError={getVisibleFieldError("designation")}
                  getErrorMessage={getFieldErrorMessage}
                  onChange={(event) => updateField("designation", event.target.value)}
                  onBlur={() => touchField("designation")}
                  autoComplete="organization-title"
                />

                <AdminFormSelect
                  id={roleId}
                  label={t("fields.role")}
                  required
                  value={values.role}
                  placeholder={t("placeholders.role")}
                  options={roleOptions}
                  disabled={saving}
                  fieldError={getVisibleFieldError("role")}
                  getErrorMessage={getFieldErrorMessage}
                  onChange={(role) => updateField("role", role as CreateUserValues["role"])}
                  onBlur={() => touchField("role")}
                />
              </div>
            </div>
          </section>

          <section className="admin-member-form__section admin-member-form__section--body">
            <p className="admin-user-form__section-title">{t("address.title")}</p>
            <div className="admin-form-grid admin-form-grid--2">
              <UserAddressFields
                values={values}
                saving={saving}
                showTitle={false}
                translate={(key) => t(key as Parameters<typeof t>[0])}
                getVisibleFieldError={(field) => getVisibleFieldError(field) ?? undefined}
                getFieldErrorMessage={getFieldErrorMessage}
                onFieldChange={updateField}
                onFieldBlur={touchField}
              />
            </div>
          </section>

          <section className="admin-member-form__section admin-member-form__section--body">
            <div className="admin-form-grid admin-form-grid--2">
              <AdminFormField
                id={passwordId}
                label={t("fields.password")}
                required
                type="password"
                value={values.password}
                placeholder={t("placeholders.password")}
                disabled={saving}
                fieldError={getVisibleFieldError("password")}
                getErrorMessage={getFieldErrorMessage}
                onChange={(event) => updateField("password", event.target.value)}
                onBlur={() => touchField("password")}
                autoComplete="new-password"
              />

              <AdminFormField
                id={confirmPasswordId}
                label={t("fields.confirmPassword")}
                required
                type="password"
                value={values.confirmPassword}
                placeholder={t("placeholders.confirmPassword")}
                disabled={saving}
                fieldError={getVisibleFieldError("confirmPassword")}
                getErrorMessage={getFieldErrorMessage}
                onChange={(event) => updateField("confirmPassword", event.target.value)}
                onBlur={() => touchField("confirmPassword")}
                autoComplete="new-password"
              />

              <div className="admin-form-grid__full admin-user-form__active">
                <label className="admin-user-form__active-toggle">
                  <input
                    type="checkbox"
                    checked={values.active}
                    onChange={(event) => updateField("active", event.target.checked)}
                    disabled={saving}
                  />
                  <span>{t("fields.active")}</span>
                </label>
              </div>
            </div>
          </section>

          <section className="admin-member-form__section admin-member-form__section--body">
            <p className="admin-user-form__section-title">{t("access.title")}</p>
            <p className="admin-user-form__section-lede">{t("access.lede")}</p>
            <UserPageAccessFields
              value={pageAccess}
              disabled={saving}
              translate={(key) => accessT(key as Parameters<typeof accessT>[0])}
              onChange={setPageAccess}
            />
          </section>
        </div>

        <div className="admin-page-actions admin-page-actions--form">
          <ButtonLink
            href={ROUTES.admin.users.root}
            variant="secondary"
            className="admin-page-actions__btn admin-page-actions__btn--reset"
          >
            {t("cancelAction")}
          </ButtonLink>
          <Button
            type="submit"
            variant="accent"
            className="admin-page-actions__btn admin-page-actions__btn--save"
            disabled={!canSave || saving}
          >
            {saving ? t("saving") : t("save")}
          </Button>
        </div>
      </div>
    </form>
  );
}
