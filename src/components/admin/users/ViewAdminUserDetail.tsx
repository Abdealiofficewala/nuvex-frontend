"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/button";
import { AdminUserDetailView } from "@/components/admin/users/AdminUserDetailView";
import { findAdminUserById, type AdminUserRecord } from "@/lib/admin-users";
import { ROUTES } from "@/lib/constants";

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
    return null;
  }

  if (!user) {
    return (
      <div className="admin-role-view admin-role-view--empty">
        <p className="admin-role-view__empty-title">{t("notFound.title")}</p>
        <p className="admin-role-view__empty-body">{t("notFound.body")}</p>
        <ButtonLink href={ROUTES.admin.users.root} variant="secondary">
          {t("cancelAction")}
        </ButtonLink>
      </div>
    );
  }

  return (
    <AdminUserDetailView
      user={user}
      backHref={ROUTES.admin.users.root}
      backLabel={t("cancelAction")}
    />
  );
}
