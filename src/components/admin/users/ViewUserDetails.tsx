"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AdminUserDetailView } from "@/components/admin/users/AdminUserDetailView";
import { ADMIN_AUTH } from "@/lib/constants";
import { getAdminUserByEmail, type AdminUserRecord } from "@/lib/admin-users";
import { getAdminUserEmail } from "@/lib/admin-session";

export function ViewUserDetails() {
  const t = useTranslations("admin.users.details");
  const [user, setUser] = useState<AdminUserRecord | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const email = getAdminUserEmail() ?? ADMIN_AUTH.demoEmail;
    setUser(getAdminUserByEmail(email) ?? null);
    setLoaded(true);
  }, []);

  if (!loaded) {
    return null;
  }

  if (!user) {
    return (
      <div className="admin-role-view admin-role-view--empty">
        <p className="admin-role-view__empty-title">{t("notFound.title")}</p>
        <p className="admin-role-view__empty-body">{t("notFound.body")}</p>
      </div>
    );
  }

  return <AdminUserDetailView user={user} />;
}
