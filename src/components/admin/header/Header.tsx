"use client";

import { useTranslations } from "next-intl";
import { AdminLanguageMenu } from "@/components/admin/header/AdminLanguageMenu";
import { AdminProfileMenu } from "@/components/admin/header/AdminProfileMenu";
import { resolveAdminHeaderKey } from "@/lib/admin-menu";
import { usePathname } from "@/i18n/routing";

export function Header() {
  const t = useTranslations("admin.header");
  const pathname = usePathname();
  const pageKey = resolveAdminHeaderKey(pathname);

  return (
    <header className="admin-header">
      <div className="admin-header__title-block">
        <p className="admin-header__eyebrow">{t("eyebrow")}</p>
        <h1 className="admin-header__title">
          {t(`pages.${pageKey}.title`)}
          <span className="admin-header__title-line" aria-hidden="true" />
        </h1>
      </div>

      <div className="admin-header__actions">
        <AdminLanguageMenu />
        <AdminProfileMenu />
      </div>
    </header>
  );
}
