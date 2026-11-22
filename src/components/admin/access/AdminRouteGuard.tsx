"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/routing";
import { ButtonLink } from "@/components/ui/buttons";
import { canAccessAdminRoute } from "@/lib/admin-access";
import { ROUTES } from "@/lib/constants";
import { useAdminAccess } from "@/components/admin/access/AdminAccessProvider";

type AdminRouteGuardProps = {
  children: React.ReactNode;
};

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const pathname = usePathname();
  const { email } = useAdminAccess();
  const t = useTranslations("admin.access");

  const allowed = canAccessAdminRoute(pathname, email);

  if (!allowed) {
    return (
      <section className="admin-um-unauthorized admin-panel">
        <p className="admin-um-unauthorized__eyebrow">{t("unauthorized.eyebrow")}</p>
        <h2 className="admin-um-unauthorized__title">{t("unauthorized.title")}</h2>
        <p className="admin-um-unauthorized__body">{t("unauthorized.body")}</p>
        <ButtonLink href={ROUTES.admin.dashboard} variant="accent">
          {t("unauthorized.action")}
        </ButtonLink>
      </section>
    );
  }

  return children;
}
