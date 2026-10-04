"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/buttons";
import { AdminUserDetailView } from "@/components/admin/users/AdminUserDetailView";
import { findAdminUserById, type AdminUserRecord } from "@/lib/admin-users";
import { ROUTES, adminUserEditHref } from "@/lib/constants";

type ViewAdminUserDetailProps = {
  id: string;
};

export function ViewAdminUserDetail({ id }: ViewAdminUserDetailProps) {
  const t = useTranslations("admin.users.view");
  const [user, setUser] = useState<AdminUserRecord | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setUser(findAdminUserById(id) ?? null);
    setLoaded(true);
  }, [id]);

  if (!loaded) {
    return (
      <div className="admin-um-profile admin-um-profile--loading" aria-busy="true" aria-live="polite">
        <div
          className="admin-um-profile__card admin-um-profile__card--split admin-um-profile__card--skeleton"
          aria-hidden="true"
        >
          <div className="admin-um-profile__skel-aside" />
          <div className="admin-um-profile__skel-main" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-um-profile admin-um-profile--empty">
        <div className="admin-um-profile__empty-card admin-panel">
          <p className="admin-um-profile__empty-title">{t("notFound.title")}</p>
          <p className="admin-um-profile__empty-body">{t("notFound.body")}</p>
          <ButtonLink href={ROUTES.admin.users.root} variant="secondary">
            {t("cancelAction")}
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <AdminUserDetailView
      user={user}
      backHref={ROUTES.admin.users.root}
      backLabel={t("cancelAction")}
      editHref={adminUserEditHref(user.id)}
      editLabel={t("editAction")}
    />
  );
}
