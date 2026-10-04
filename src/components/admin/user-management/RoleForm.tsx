"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { AdminFormField } from "@/components/admin/common/AdminFormField";
import { AdminUmFormLayout } from "@/components/admin/common/AdminUmFormLayout";
import {
  PermissionCoverageSummary,
  PermissionMatrix,
} from "@/components/admin/user-management/PermissionMatrix";
import { summarizeRolePermissions } from "@/lib/admin-role-permissions";
import { Button, ButtonLink } from "@/components/ui/buttons";
import { useToast } from "@/components/ui/toast";
import { getDefaultPageAccess } from "@/lib/admin-page-access.config";
import {
  findAdminRoleById,
  saveAdminRole,
  updateAdminRole,
  type AdminRoleRecord,
} from "@/lib/admin-roles";
import { ROUTES, adminRoleViewHref } from "@/lib/constants";
import { capitalizeFieldText, cn } from "@/lib/utils";
import {
  isAdminRoleFormValid,
  validateAdminRoleForm,
  type AdminRoleErrorKey,
  type AdminRoleField,
} from "@/lib/validations/admin-role";

type RoleFormProps = {
  editId?: string;
};

export function RoleForm({ editId }: RoleFormProps) {
  const isEdit = Boolean(editId);
  const t = useTranslations(isEdit ? "admin.users.roles.edit" : "admin.users.roles.create");
  const tAccess = useTranslations("admin.users.access");
  const tView = useTranslations("admin.users.roles.view");
  const tStatus = useTranslations("admin.users.roles.listing.status");
  const toast = useToast();
  const router = useRouter();
  const nameId = useId();
  const descriptionId = useId();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);
  const [permissions, setPermissions] = useState(() => getDefaultPageAccess("read"));
  const [touchedFields, setTouchedFields] = useState<Partial<Record<AdminRoleField, boolean>>>({});
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(!isEdit);

  useEffect(() => {
    if (!editId) {
      return;
    }

    const role = findAdminRoleById(editId);
    if (role) {
      setName(role.name);
      setDescription(role.description);
      setActive(role.active);
      setPermissions(role.permissions);
    }

    setLoaded(true);
  }, [editId]);

  const fieldErrors = validateAdminRoleForm({ name });
  const canSave = loaded && isAdminRoleFormValid(fieldErrors);
  const permissionSummary = useMemo(() => summarizeRolePermissions(permissions), [permissions]);

  function touchField(field: AdminRoleField) {
    setTouchedFields((current) => ({ ...current, [field]: true }));
  }

  function getVisibleFieldError(field: AdminRoleField): AdminRoleErrorKey | undefined {
    return touchedFields[field] ? fieldErrors[field] : undefined;
  }

  function getFieldErrorMessage(errorKey: string) {
    return t(`errors.${errorKey as AdminRoleErrorKey}`);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouchedFields({ name: true });

    if (!canSave) {
      toast.error(t("errors.title"), t("errors.validation"));
      return;
    }

    const payload = {
      name: capitalizeFieldText(name),
      description: capitalizeFieldText(description),
      active,
      permissions,
    };

    setSaving(true);

    try {
      let record: AdminRoleRecord | undefined;
      if (isEdit && editId) {
        record = updateAdminRole(editId, payload);
      } else {
        record = saveAdminRole(payload);
      }

      if (!record) {
        throw new Error("save failed");
      }

      toast.success(t("success.title"), t("success.body"));
      router.push(isEdit ? adminRoleViewHref(record.id) : ROUTES.admin.users.roles);
    } catch {
      toast.error(t("errors.title"), t("errors.generic"));
    } finally {
      setSaving(false);
    }
  }

  if (isEdit && loaded && editId && !findAdminRoleById(editId)) {
    return (
      <div className="admin-role-view admin-role-view--empty">
        <p className="admin-role-view__empty-title">{tView("notFound.title")}</p>
        <p className="admin-role-view__empty-body">{tView("notFound.body")}</p>
        <ButtonLink href={ROUTES.admin.users.roles} variant="secondary">
          {t("cancelAction")}
        </ButtonLink>
      </div>
    );
  }

  return (
    <AdminUmFormLayout
      layout="split"
      onSubmit={onSubmit}
      aside={
        <>
          <h2 className="admin-um-role-form__title">{t("sections.role")}</h2>
          <div className="admin-um-role-form__fields">
            <AdminFormField
              id={nameId}
              label={t("fields.name")}
              required
              value={name}
              placeholder={t("placeholders.name")}
              disabled={saving}
              fieldError={getVisibleFieldError("name")}
              getErrorMessage={getFieldErrorMessage}
              onChange={(event) => setName(event.target.value)}
              onBlur={() => touchField("name")}
            />
            <AdminFormField
              id={descriptionId}
              label={t("fields.description")}
              value={description}
              placeholder={t("placeholders.description")}
              disabled={saving}
              onChange={(event) => setDescription(event.target.value)}
            />
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
          <PermissionCoverageSummary
            className="admin-um-role-form__coverage"
            summary={permissionSummary}
            t={tAccess}
            variant="sidebar"
          />
        </>
      }
      footer={
        <>
          <ButtonLink href={ROUTES.admin.users.roles} variant="secondary">
            {t("cancelAction")}
          </ButtonLink>
          <Button type="submit" variant="accent" disabled={!canSave || saving}>
            {saving ? t("saving") : isEdit ? t("update") : t("save")}
          </Button>
        </>
      }
    >
      <header className="admin-um-role-form__main-head">
        <h3>{t("sections.permissions")}</h3>
      </header>
      <PermissionMatrix
        value={permissions}
        disabled={saving}
        showBulkControls={isEdit}
        showCoverageSummary={false}
        onChange={setPermissions}
      />
    </AdminUmFormLayout>
  );
}
