"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { AdminEmptyState, AdminFormSelect, formatListingToolbarMeta } from "@/components/admin/common";
import { UserPageAccessFields } from "@/components/admin/users/UserPageAccessFields";
import { Button, ButtonLink } from "@/components/ui/buttons";
import { useToast } from "@/components/ui/toast";
import type { AdminUserPageAccess } from "@/lib/admin-page-access.config";
import {
  ADMIN_USER_ROLES,
  ADMIN_USERS_UPDATED_EVENT,
  findAdminUserById,
  getAdminUserFullName,
  getAdminUserPageAccess,
  getAdminUserPhone,
  getAdminUsers,
  saveAdminPageAccess,
} from "@/lib/admin-users";
import { ROUTES } from "@/lib/constants";
import { cn, hasValue, initials } from "@/lib/utils";

type PageAccessFormProps = {
  userId?: string;
  mode?: "create" | "edit";
};

const ALL_ROLES_VALUE = "all";

export function PageAccessForm({ userId, mode = userId ? "edit" : "create" }: PageAccessFormProps) {
  const t = useTranslations("admin.users.access.form");
  const sharedT = useTranslations("admin.users.access");
  const toast = useToast();
  const router = useRouter();
  const roleSelectId = useId();
  const userSelectId = useId();
  const [users, setUsers] = useState(getAdminUsers());
  const [selectedRole, setSelectedRole] = useState<string>(ALL_ROLES_VALUE);
  const [selectedUserId, setSelectedUserId] = useState(userId ?? "");
  const [access, setAccess] = useState<AdminUserPageAccess>({});
  const [saving, setSaving] = useState(false);

  function syncUsers() {
    setUsers(getAdminUsers());
  }

  useEffect(() => {
    syncUsers();
    window.addEventListener(ADMIN_USERS_UPDATED_EVENT, syncUsers);
    return () => window.removeEventListener(ADMIN_USERS_UPDATED_EVENT, syncUsers);
  }, []);

  useEffect(() => {
    if (userId) {
      setSelectedUserId(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (!selectedUserId) {
      setAccess({});
      return;
    }

    setAccess(getAdminUserPageAccess(selectedUserId));
  }, [selectedUserId]);

  const filteredUsers = useMemo(() => {
    if (selectedRole === ALL_ROLES_VALUE) {
      return users;
    }

    return users.filter((user) => user.role === selectedRole);
  }, [selectedRole, users]);

  useEffect(() => {
    if (mode !== "create" || selectedUserId || !users.length) {
      return;
    }

    setSelectedUserId(users[0]?.id ?? "");
  }, [mode, selectedUserId, users]);

  useEffect(() => {
    if (mode !== "create" || !selectedUserId) {
      return;
    }

    if (!filteredUsers.some((user) => user.id === selectedUserId)) {
      setSelectedUserId(filteredUsers[0]?.id ?? "");
    }
  }, [filteredUsers, mode, selectedUserId]);

  const selectedUser = useMemo(
    () => findAdminUserById(selectedUserId) ?? users.find((user) => user.id === selectedUserId),
    [selectedUserId, users],
  );

  const roleOptions = useMemo(
    () => [
      { label: t("allRoles"), value: ALL_ROLES_VALUE },
      ...ADMIN_USER_ROLES.map((role) => ({
        label: t(`roles.${role}`),
        value: role,
      })),
    ],
    [t],
  );

  const userOptions = useMemo(
    () =>
      filteredUsers.map((user) => {
        const name = getAdminUserFullName(user);

        return {
          label: name || user.email,
          value: user.id,
        };
      }),
    [filteredUsers],
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedUserId) {
      return;
    }

    setSaving(true);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 360));
      saveAdminPageAccess(selectedUserId, access);
      toast.success(t("success.title"), t("success.body"));
      router.push(ROUTES.admin.users.access);
    } catch {
      toast.error(t("errors.title"), t("errors.generic"));
    } finally {
      setSaving(false);
    }
  }

  if (!users.length) {
    return (
      <div className="admin-table-root">
        <div className="admin-table-panel admin-table-panel--empty">
          <div className="admin-table-panel__toolbar">
            <div className="admin-table-panel__toolbar-start">
              <p className="admin-page-toolbar__meta">
                {formatListingToolbarMeta({ count: 0, title: sharedT("listing.toolbarTitle") })}
              </p>
            </div>
            <div className="admin-table-panel__toolbar-end">
              <ButtonLink href={ROUTES.admin.users.create} variant="accent" className="admin-page-toolbar__action">
                {t("empty.action")}
              </ButtonLink>
            </div>
          </div>
          <AdminEmptyState />
        </div>
      </div>
    );
  }

  if (mode === "edit" && userId && !selectedUser) {
    return (
      <AdminEmptyState title={t("notFound.title")} description={t("notFound.body")} />
    );
  }

  const selectedName = selectedUser ? getAdminUserFullName(selectedUser) : "";
  const selectedPhone = selectedUser ? getAdminUserPhone(selectedUser) : "";

  return (
    <form className="admin-access-form" onSubmit={onSubmit}>
      <section className="admin-access-form__section">
        <div className="admin-access-form__section-head">
          <h2 className="admin-access-form__section-title">{t("sections.user")}</h2>
          <p className="admin-access-form__section-lede">{t("sections.userLede")}</p>
        </div>

        {mode === "create" ? (
          <div className="admin-access-form__picker-grid">
            <AdminFormSelect
              id={roleSelectId}
              label={t("selectRole")}
              value={selectedRole}
              options={roleOptions}
              disabled={saving}
              className="admin-access-form__select admin-form-select--access"
              onChange={setSelectedRole}
            />
            <AdminFormSelect
              id={userSelectId}
              label={t("selectName")}
              value={selectedUserId}
              options={userOptions}
              disabled={saving || !userOptions.length}
              placeholder={userOptions.length ? t("selectNamePlaceholder") : t("noUsersForRole")}
              className="admin-access-form__select admin-form-select--access"
              onChange={setSelectedUserId}
            />
          </div>
        ) : null}

        {selectedUser ? (
          <div className="admin-access-form__profile">
            <span className="admin-access-form__profile-avatar" aria-hidden="true">
              {hasValue(selectedUser.image) ? (
                selectedUser.image.startsWith("data:") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={selectedUser.image} alt="" className="admin-table-member__native-image" />
                ) : (
                  <Image src={selectedUser.image} alt="" fill sizes="72px" />
                )
              ) : (
                <span className="admin-table-member__initials">{initials(selectedName || selectedUser.email)}</span>
              )}
            </span>

            <div className="admin-access-form__profile-copy">
              <div className="admin-access-form__profile-top">
                <strong>{selectedName || selectedUser.email}</strong>
                <span className={cn("admin-table-role", `admin-table-role--${selectedUser.role}`)}>
                  <span className="admin-table-role__dot" aria-hidden="true" />
                  <span className="admin-table-role__text">{t(`roles.${selectedUser.role}`)}</span>
                </span>
              </div>
              <div className="admin-access-form__profile-meta">
                <span>{selectedUser.email}</span>
                {selectedPhone ? <span>{selectedPhone}</span> : null}
                {selectedUser.designation ? <span>{selectedUser.designation}</span> : null}
              </div>
            </div>
          </div>
        ) : null}
      </section>

      {selectedUser ? (
        <section className="admin-access-form__section">
          <div className="admin-access-form__section-head">
            <h2 className="admin-access-form__section-title">{t("sections.permissions")}</h2>
            <p className="admin-access-form__section-lede">{t("sections.permissionsLede")}</p>
          </div>

          <UserPageAccessFields
            value={access}
            disabled={saving}
            translate={(key) =>
              key.startsWith("menus") ||
              key.startsWith("permissions") ||
              key.startsWith("columns")
                ? sharedT(key as Parameters<typeof sharedT>[0])
                : t(key as Parameters<typeof t>[0])
            }
            onChange={setAccess}
          />
        </section>
      ) : null}

      <footer className="admin-access-form__footer">
        <ButtonLink
          href={ROUTES.admin.users.access}
          variant="secondary"
          className="admin-access-form__footer-btn admin-access-form__footer-btn--cancel"
        >
          {t("cancelAction")}
        </ButtonLink>
        <Button
          type="submit"
          variant="accent"
          className="admin-access-form__footer-btn admin-access-form__footer-btn--save"
          disabled={saving || !selectedUserId}
        >
          {saving ? t("saving") : t("save")}
        </Button>
      </footer>
    </form>
  );
}
