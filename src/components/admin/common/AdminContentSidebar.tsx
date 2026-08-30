"use client";

import { useTranslations } from "next-intl";
import { AdminNavIcon } from "@/components/admin/dashboard/DashboardIcons";
import { Link, usePathname } from "@/i18n/routing";
import { isAdminMenuPageActive, type AdminMenuNavLabelKey, type AdminMenuPage } from "@/lib/admin-menu";
import { cn } from "@/lib/utils";

export type AdminContentSidebarProps = {
  titleKey: AdminMenuNavLabelKey;
  pages: readonly AdminMenuPage[];
};

export function AdminContentSidebar({ titleKey, pages }: AdminContentSidebarProps) {
  const t = useTranslations("admin.nav");
  const pathname = usePathname();
  const siblingRoutes = pages.map((page) => page.route);

  return (
    <aside className="admin-content-sidebar" aria-label={t(titleKey)}>
      <p className="admin-content-sidebar__title">{t(titleKey)}</p>

      <nav className="admin-content-sidebar__nav">
        {pages.map((page) => {
          const active = isAdminMenuPageActive(pathname, page.route, siblingRoutes);

          return (
            <Link
              key={page.key}
              href={page.route}
              className={cn("admin-content-sidebar__link", active && "is-active")}
              aria-current={active ? "page" : undefined}
            >
              <span className="admin-content-sidebar__icon" aria-hidden="true">
                <AdminNavIcon name={page.icon} />
              </span>
              <span className="admin-content-sidebar__label">{t(page.navLabelKey)}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
