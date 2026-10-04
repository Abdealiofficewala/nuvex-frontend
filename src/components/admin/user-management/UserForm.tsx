"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import {
  AdminFormField,
  AdminFormSelect,
  AdminPhoneField,
  AdminProfilePhotoUpload,
  AdminUmFormLayout,
  AdminUmFormSection,
} from "@/components/admin/common";
import { UserAddressFields } from "@/components/admin/users/UserAddressFields";
import { Button, ButtonLink } from "@/components/ui/buttons";
import { useToast } from "@/components/ui/toast";
import { getAdminRoles } from "@/lib/admin-roles";
import {
  findAdminUserById,
  updateAdminUser,
  ADMIN_USER_ROLES,
  saveAdminUser,
  type AdminUserRecord,
  type AdminUserRole,
} from "@/lib/admin-users";
import { ROUTES, adminUserViewHref } from "@/lib/constants";
import { DEFAULT_PHONE_COUNTRY_CODE } from "@/lib/phone-countries.config";
import {
  ADMIN_USER_PROFILE_TOUCH_FIELDS,
  isAdminUserProfileFormValid,
  validateAdminUserProfileForm,
  validateCreateUserForm,
  isCreateUserFormValid,
  type AdminUserProfileErrorKey,
  type AdminUserProfileField,
  type AdminUserProfileValues,
  type CreateUserField,
} from "@/lib/validations/admin-user";
import { capitalizeFieldText, cn, initials } from "@/lib/utils";

type UserFormProps = {
  userId?: string;
};

type FormValues = AdminUserProfileValues & {
  roleId: string;
};

const emptyValues: FormValues = {
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
  roleId: "",
};

export function UserForm({ userId }: UserFormProps) {
  const isEdit = Boolean(userId);
  const t = useTranslations(isEdit ? "admin.users.edit" : "admin.users.create");
  const tSections = useTranslations("admin.users.profile.sections");
  const tStatus = useTranslations("admin.users.listing.status");
  const toast = useToast();
  const router = useRouter();
  const roleFieldId = useId();
  const imageId = useId();
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [active, setActive] = useState(true);
  const [legacyRole, setLegacyRole] = useState<AdminUserRole>("viewer");
  const [touchedFields, setTouchedFields] = useState<Partial<Record<CreateUserField, boolean>>>({});
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(!isEdit);

  const roleOptions = useMemo(
    () =>
      getAdminRoles()
        .filter((role) => isEdit || role.active)
        .map((role) => ({ label: role.name, value: role.id })),
    [isEdit],
  );

  useEffect(() => {
    if (!userId) {
      return;
    }

    const user = findAdminUserById(userId);
    if (user) {
      hydrateFromUser(user);
    }
    setLoaded(true);
  }, [userId]);

  function hydrateFromUser(user: AdminUserRecord) {
    setValues({
      ...emptyValues,
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
      roleId: user.roleId ?? "",
    });
    setActive(user.active);
    setLegacyRole(user.role);
  }

  const profileErrors = validateAdminUserProfileForm(values);
  const createErrors = isEdit
    ? {}
    : validateCreateUserForm({
        ...values,
        active,
        roleId: values.roleId,
      });
  const fieldErrors = { ...profileErrors, ...createErrors };

  const canSave = loaded
    && (isEdit
      ? Boolean(values.roleId) && isAdminUserProfileFormValid(profileErrors)
      : isCreateUserFormValid(createErrors));

  function touchField(field: CreateUserField | AdminUserProfileField) {
    setTouchedFields((current) => ({ ...current, [field]: true }));
  }

  function getVisibleFieldError(
    field: CreateUserField | AdminUserProfileField,
  ): string | undefined {
    if (!touchedFields[field]) {
      return undefined;
    }

    return fieldErrors[field as keyof typeof fieldErrors];
  }

  function getFieldErrorMessage(errorKey: string) {
    return t(`errors.${errorKey as AdminUserProfileErrorKey | "roleRequired"}`);
  }

  function updateField<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    if (field !== "image") {
      touchField(
        field === "phoneCountryCode" || field === "phoneNumber"
          ? "phone"
          : (field as CreateUserField),
      );
    }

    setValues((current) => ({ ...current, [field]: value }));
  }

  function resolveLegacyRole(roleId: string): AdminUserRole {
    const selectedRole = getAdminRoles().find((role) => role.id === roleId);
    if (selectedRole?.name.toLowerCase().includes("admin")) {
      return "admin";
    }
    if (selectedRole?.name.toLowerCase().includes("edit")) {
      return "editor";
    }
    return "viewer";
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const touchList: (CreateUserField | AdminUserProfileField)[] = isEdit
      ? [...ADMIN_USER_PROFILE_TOUCH_FIELDS, "roleId" as CreateUserField]
      : [...ADMIN_USER_PROFILE_TOUCH_FIELDS, "roleId"];

    setTouchedFields(
      touchList.reduce(
        (acc, field) => {
          acc[field as CreateUserField] = true;
          return acc;
        },
        {} as Partial<Record<CreateUserField, boolean>>,
      ),
    );

    if (!canSave) {
      toast.error(t("errors.title"), t("errors.validation"));
      return;
    }

    setSaving(true);

    try {
      if (isEdit && userId) {
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
          roleId: values.roleId,
          role: legacyRole,
          active,
        });
        toast.success(t("success.title"), t("success.body"));
        router.push(adminUserViewHref(userId));
      } else {
        const roleId = values.roleId;
        const legacy = resolveLegacyRole(roleId);

        await new Promise((resolve) => window.setTimeout(resolve, 420));

        saveAdminUser({
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
          role: legacy as (typeof ADMIN_USER_ROLES)[number],
          roleId,
          active,
        });

        toast.success(t("success.title"), t("success.body"));
        router.push(ROUTES.admin.users.root);
      }
    } catch {
      toast.error(t("errors.title"), t("errors.generic"));
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (values.roleId) {
      setLegacyRole(resolveLegacyRole(values.roleId));
    }
  }, [values.roleId]);

  if (isEdit && loaded && userId && !findAdminUserById(userId)) {
    return null;
  }

  const translateAddress = (key: string) => t(key as Parameters<typeof t>[0]);

  const accessSectionTitle = isEdit ? tSections("account") : t("sections.access");
  const photoInitials = initials(
    `${values.firstName} ${values.lastName}`.trim() || values.email,
  );

  return (
    <AdminUmFormLayout
      layout="single"
      onSubmit={onSubmit}
      footer={
        <>
          <ButtonLink href={ROUTES.admin.users.root} variant="secondary">
            {t("cancelAction")}
          </ButtonLink>
          <Button type="submit" variant="accent" disabled={!canSave || saving}>
            {saving ? t("saving") : isEdit ? t("update") : t("save")}
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
              id="user-first-name"
              label={t("fields.firstName")}
              required
              value={values.firstName}
              placeholder={!isEdit ? t("placeholders.firstName") : undefined}
              disabled={saving}
              fieldError={getVisibleFieldError("firstName")}
              getErrorMessage={getFieldErrorMessage}
              onChange={(event) => updateField("firstName", event.target.value)}
              onBlur={() => touchField("firstName")}
            />
            <AdminFormField
              id="user-last-name"
              label={t("fields.lastName")}
              required
              value={values.lastName}
              placeholder={!isEdit ? t("placeholders.lastName") : undefined}
              disabled={saving}
              fieldError={getVisibleFieldError("lastName")}
              getErrorMessage={getFieldErrorMessage}
              onChange={(event) => updateField("lastName", event.target.value)}
              onBlur={() => touchField("lastName")}
            />
            <AdminFormField
              id="user-email"
              label={t("fields.email")}
              required
              type="email"
              value={values.email}
              placeholder={!isEdit ? t("placeholders.email") : undefined}
              disabled={saving}
              fieldError={getVisibleFieldError("email")}
              getErrorMessage={getFieldErrorMessage}
              onChange={(event) => updateField("email", event.target.value)}
              onBlur={() => touchField("email")}
            />
            <AdminPhoneField
              id="user-phone"
              label={t("fields.phone")}
              required
              countryCode={values.phoneCountryCode}
              number={values.phoneNumber}
              placeholder={!isEdit ? t("placeholders.phone") : undefined}
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
              id="user-designation"
              label={t("fields.designation")}
              required
              value={values.designation}
              placeholder={!isEdit ? t("placeholders.designation") : undefined}
              disabled={saving}
              fieldError={getVisibleFieldError("designation")}
              getErrorMessage={getFieldErrorMessage}
              onChange={(event) => updateField("designation", event.target.value)}
              onBlur={() => touchField("designation")}
            />
      </AdminUmFormSection>

      <AdminUmFormSection title={accessSectionTitle}>
        <AdminFormSelect
          id={roleFieldId}
          label={t("fields.role")}
          required
          value={values.roleId}
          placeholder={!isEdit ? t("placeholders.role") : undefined}
          options={roleOptions}
          disabled={saving}
          fieldError={getVisibleFieldError("roleId")}
          getErrorMessage={getFieldErrorMessage}
          onChange={(nextRoleId) => updateField("roleId", nextRoleId)}
          onBlur={() => touchField("roleId")}
        />
        <div className="admin-form-grid__full">
          <label className={cn("admin-um-role-active", active && "is-on")}>
            <input
              type="checkbox"
              className="admin-um-role-active__input"
              checked={active}
              disabled={saving}
              onChange={(event) => setActive(event.target.checked)}
            />
            <span className="admin-um-role-active__switch" aria-hidden="true">
              <span className="admin-um-role-active__switch-thumb" />
            </span>
            <span className="admin-um-role-active__copy">
              <span className="admin-um-role-active__label">{t("fields.active")}</span>
              <span className="admin-um-role-active__status">
                {active ? tStatus("active") : tStatus("inactive")}
              </span>
            </span>
          </label>
        </div>
      </AdminUmFormSection>

      <AdminUmFormSection title={tSections("address")}>
        <UserAddressFields
          values={values}
          saving={saving}
          showTitle={false}
          translate={translateAddress}
          getVisibleFieldError={(field) => getVisibleFieldError(field) ?? undefined}
          getFieldErrorMessage={getFieldErrorMessage}
          onFieldChange={updateField}
          onFieldBlur={touchField}
        />
      </AdminUmFormSection>
    </AdminUmFormLayout>
  );
}
