"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { AdminEmptyState } from "@/components/admin/common";
import { UserPageAccessFields } from "@/components/admin/users/UserPageAccessFields";
import { ButtonLink } from "@/components/ui/buttons";
import {
  ADMIN_USERS_UPDATED_EVENT,
  findAdminUserById,
  getAdminUserFullName,
  getAdminUserPageAccess,
  getAdminUserPhone,
} from "@/lib/admin-users";
import { ROUTES, adminPageAccessEditHref } from "@/lib/constants";

type ViewPageAccessDetailProps = {
  userId: string;
};

export function ViewPageAccessDetail({ userId }: ViewPageAccessDetailProps) {
  const t = useTranslations("admin.users.access.view");
  const sharedT = useTranslations("admin.users.access");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const sync = () => setRefreshKey((current) => current + 1);
    window.addEventListener(ADMIN_USERS_UPDATED_EVENT, sync);
    return () => window.removeEventListener(ADMIN_USERS_UPDATED_EVENT, sync);
  }, []);

  const user = useMemo(() => findAdminUserById(userId), [userId, refreshKey]);
  const access = useMemo(() => getAdminUserPageAccess(userId), [userId, refreshKey]);

  if (!user) {
    return <AdminEmptyState title={t("notFound.title")} description={t("notFound.body")} />;
  }

  const name = getAdminUserFullName(user);
  const phone = getAdminUserPhone(user);

  return (
    <section className="admin-access-view">
      <div className="admin-panel admin-access-view__panel">
        <div className="admin-access-form__details">
          <div className="admin-access-form__detail">
            <span>{t("details.name")}</span>
            <strong>{name || "—"}</strong>
          </div>
          <div className="admin-access-form__detail">
            <span>{t("details.email")}</span>
            <strong>{user.email}</strong>
          </div>
          <div className="admin-access-form__detail">
            <span>{t("details.phone")}</span>
            <strong>{phone || "—"}</strong>
          </div>
          <div className="admin-access-form__detail">
            <span>{t("details.role")}</span>
            <strong>{t(`roles.${user.role}`)}</strong>
          </div>
        </div>

        <UserPageAccessFields
          value={access}
          readOnly
          translate={(key) =>
            key.startsWith("menus") || key.startsWith("permissions") || key.startsWith("columns")
              ? sharedT(key as Parameters<typeof sharedT>[0])
              : t(key as Parameters<typeof t>[0])
          }
        />

        <div className="admin-page-actions admin-page-actions--form">
          <ButtonLink
            href={ROUTES.admin.users.access}
            variant="secondary"
            className="admin-page-actions__btn admin-page-actions__btn--reset"
          >
            {t("cancelAction")}
          </ButtonLink>
          <ButtonLink
            href={adminPageAccessEditHref(user.id)}
            variant="accent"
            className="admin-page-actions__btn admin-page-actions__btn--save"
          >
            {t("editAction")}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
