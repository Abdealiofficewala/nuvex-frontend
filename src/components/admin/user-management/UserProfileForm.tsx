"use client";

import { useEffect, useId, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import {
  AdminFormField,
  AdminPhoneField,
  AdminProfilePhotoUpload,
  AdminUmFormLayout,
  AdminUmFormSection,
} from "@/components/admin/common";
import { UserAddressFields } from "@/components/admin/users/UserAddressFields";
import { Button, ButtonLink } from "@/components/ui/buttons";
import { useToast } from "@/components/ui/toast";
import { ROUTES } from "@/lib/constants";
import {
  ensureAdminUserForEmail,
  updateAdminUser,
} from "@/lib/admin-users";
import { getAdminUserEmail } from "@/lib/admin-session";
import {
  ADMIN_USER_PROFILE_TOUCH_FIELDS,
  isAdminUserProfileFormValid,
  validateAdminUserProfileForm,
  type AdminUserProfileErrorKey,
  type AdminUserProfileField,
  type AdminUserProfileValues,
} from "@/lib/validations/admin-user";
import { capitalizeFieldText, initials } from "@/lib/utils";

export function UserProfileForm() {
  const t = useTranslations("admin.users.profile.edit");
  const tSections = useTranslations("admin.users.profile.sections");
  const toast = useToast();
  const router = useRouter();
  const imageId = useId();
  const [userId, setUserId] = useState<string | null>(null);
  const [values, setValues] = useState<AdminUserProfileValues>({
    firstName: "",
    lastName: "",
    email: "",
    phoneCountryCode: "+91",
    phoneNumber: "",
    image: "",
    designation: "",
    addressLine1: "",
    addressLine2: "",
    village: "",
    city: "",
    pincode: "",
    state: "",
  });
  const [touchedFields, setTouchedFields] = useState<Partial<Record<AdminUserProfileField, boolean>>>({});
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const email = getAdminUserEmail();
    const user = email ? ensureAdminUserForEmail(email) : undefined;
    if (user) {
      setUserId(user.id);
      setValues({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneCountryCode: user.phoneCountryCode,
        phoneNumber: user.phoneNumber,
        image: user.image,
        designation: user.designation,
        addressLine1: user.addressLine1,
        addressLine2: user.addressLine2,
        village: user.village,
        city: user.city,
        pincode: user.pincode,
        state: user.state,
      });
    }
    setLoaded(true);
  }, []);

  const fieldErrors = validateAdminUserProfileForm(values);
  const canSave = loaded && Boolean(userId) && isAdminUserProfileFormValid(fieldErrors);

  function touchField(field: AdminUserProfileField) {
    setTouchedFields((current) => ({ ...current, [field]: true }));
  }

  function getVisibleFieldError(field: AdminUserProfileField): AdminUserProfileErrorKey | undefined {
    return touchedFields[field] ? fieldErrors[field] : undefined;
  }

  function getFieldErrorMessage(errorKey: string) {
    return t(`errors.${errorKey as AdminUserProfileErrorKey}`);
  }

  function updateField<K extends keyof AdminUserProfileValues>(field: K, value: AdminUserProfileValues[K]) {
    touchField(field === "phoneCountryCode" || field === "phoneNumber" ? "phone" : (field as AdminUserProfileField));
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouchedFields(
      ADMIN_USER_PROFILE_TOUCH_FIELDS.reduce(
        (acc, field) => {
          acc[field] = true;
          return acc;
        },
        {} as Partial<Record<AdminUserProfileField, boolean>>,
      ),
    );

    if (!canSave || !userId) {
      toast.error(t("errors.title"), t("errors.validation"));
      return;
    }

    setSaving(true);
    try {
      updateAdminUser(userId, {
        firstName: capitalizeFieldText(values.firstName),
        lastName: capitalizeFieldText(values.lastName),
        email: values.email.trim().toLowerCase(),
        phoneCountryCode: values.phoneCountryCode,
        phoneNumber: values.phoneNumber,
        image: values.image,
        designation: capitalizeFieldText(values.designation),
        addressLine1: capitalizeFieldText(values.addressLine1),
        addressLine2: capitalizeFieldText(values.addressLine2),
        village: capitalizeFieldText(values.village),
        city: capitalizeFieldText(values.city),
        pincode: values.pincode.trim(),
        state: capitalizeFieldText(values.state),
      });
      toast.success(t("success.title"), t("success.body"));
      router.push(ROUTES.admin.users.profile);
    } catch {
      toast.error(t("errors.title"), t("errors.generic"));
    } finally {
      setSaving(false);
    }
  }

  if (loaded && !userId) {
    return null;
  }

  const photoInitials = initials(
    `${values.firstName} ${values.lastName}`.trim() || values.email,
  );

  return (
    <AdminUmFormLayout
      layout="single"
      onSubmit={onSubmit}
      footer={
        <>
          <ButtonLink href={ROUTES.admin.users.profile} variant="secondary">
            {t("cancelAction")}
          </ButtonLink>
          <Button type="submit" variant="accent" disabled={!canSave || saving}>
            {saving ? t("saving") : t("update")}
          </Button>
        </>
      }
    >
      <AdminUmFormSection title={tSections("personal")}>
        <div className="admin-form-grid__full">
          <AdminProfilePhotoUpload
            id={imageId}
            label={t("fields.image")}
            value={values.image}
            disabled={saving}
            placeholderInitials={photoInitials}
            onChange={(image) => updateField("image", image)}
          />
        </div>
        <AdminFormField
          id="profile-first-name"
          label={t("fields.firstName")}
          required
          value={values.firstName}
          disabled={saving}
          fieldError={getVisibleFieldError("firstName")}
          getErrorMessage={getFieldErrorMessage}
          onChange={(event) => updateField("firstName", event.target.value)}
        />
        <AdminFormField
          id="profile-last-name"
          label={t("fields.lastName")}
          required
          value={values.lastName}
          disabled={saving}
          fieldError={getVisibleFieldError("lastName")}
          getErrorMessage={getFieldErrorMessage}
          onChange={(event) => updateField("lastName", event.target.value)}
        />
        <AdminFormField
          id="profile-email"
          label={t("fields.email")}
          required
          type="email"
          value={values.email}
          disabled={saving}
          fieldError={getVisibleFieldError("email")}
          getErrorMessage={getFieldErrorMessage}
          onChange={(event) => updateField("email", event.target.value)}
        />
        <AdminPhoneField
          id="profile-phone"
          label={t("fields.phone")}
          required
          countryCode={values.phoneCountryCode}
          number={values.phoneNumber}
          disabled={saving}
          error={
            getVisibleFieldError("phone")
              ? getFieldErrorMessage(getVisibleFieldError("phone")!)
              : undefined
          }
          onCountryChange={(countryCode) => updateField("phoneCountryCode", countryCode)}
          onNumberChange={(number) => updateField("phoneNumber", number)}
        />
        <AdminFormField
          id="profile-designation"
          label={t("fields.designation")}
          required
          value={values.designation}
          disabled={saving}
          fieldError={getVisibleFieldError("designation")}
          getErrorMessage={getFieldErrorMessage}
          onChange={(event) => updateField("designation", event.target.value)}
        />
      </AdminUmFormSection>

      <AdminUmFormSection title={tSections("address")}>
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
      </AdminUmFormSection>
    </AdminUmFormLayout>
  );
}
