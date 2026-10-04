"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { BackToWebsiteIcon } from "@/components/admin/header/AdminMenuIcons";
import { AdminNavIcon } from "@/components/admin/dashboard/DashboardIcons";
import { BrandLogo } from "@/components/website/common/BrandLogo";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useAdminAccess } from "@/components/admin/access/AdminAccessProvider";
import {
  ADMIN_MENU,
  isAdminMenuGroupActive,
  isAdminMenuPageActive,
  type AdminMenuGroup,
  type AdminMenuPage,
} from "@/lib/admin-menu";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

type SidebarProps = {
  expanded: boolean;
};

function GroupChevron({ open }: { open: boolean }) {
  return (
    <svg
      className={cn("admin-sidebar__group-chevron", open && "is-open")}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9 6.5 15 12l-6 5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function resolveActiveGroupKey(pathname: string) {
  return ADMIN_MENU.find(
    (entry): entry is AdminMenuGroup => entry.kind === "group" && isAdminMenuGroupActive(pathname, entry),
  )?.key;
}

export function Sidebar({ expanded }: SidebarProps) {
  const t = useTranslations("admin.nav");
  const pathname = usePathname();
  const router = useRouter();
  const { canViewMenuPage } = useAdminAccess();
  const [openGroupKey, setOpenGroupKey] = useState<string | null>(() => resolveActiveGroupKey(pathname) ?? null);

  useEffect(() => {
    if (!expanded) {
      setOpenGroupKey(null);
      return;
    }

    setOpenGroupKey(resolveActiveGroupKey(pathname) ?? null);
  }, [expanded, pathname]);

  const handleGroupToggle = (entry: AdminMenuGroup) => {
    if (openGroupKey === entry.key) {
      setOpenGroupKey(null);
      return;
    }

    setOpenGroupKey(entry.key);

    const visibleChildren = entry.children.filter((child) => canViewMenuPage(child));
    const onGroupPage = visibleChildren.some((child) => child.route === pathname);
    const firstRoute = visibleChildren[0]?.route;

    if (firstRoute && !onGroupPage) {
      router.push(firstRoute);
    }
  };

  function getVisibleChildren(children: readonly AdminMenuPage[]) {
    return children.filter((child) => canViewMenuPage(child));
  }

  return (
    <aside className={cn("admin-sidebar", expanded && "is-expanded")}>
      <div className="admin-sidebar__glow" aria-hidden="true" />

      <header className="admin-sidebar__header">
        <BrandLogo
          variant="light"
          layout={expanded ? "horizontal" : "symbol-only"}
          height={expanded ? 36 : 30}
        />
      </header>

      <div className="admin-sidebar__body">
        <div className="admin-sidebar__nav-group">
          <p className="admin-sidebar__section">{t("mainMenu")}</p>

          <nav className="admin-sidebar__nav" aria-label={t("mainMenu")}>
            {ADMIN_MENU.map((entry) => {
              if (entry.kind === "group") {
                const visibleChildren = getVisibleChildren(entry.children);
                if (!visibleChildren.length) {
                  return null;
                }

                const groupActive = isAdminMenuGroupActive(pathname, entry);
                const groupHref = visibleChildren[0]?.route ?? ROUTES.admin.dashboard;
                const isOpen = expanded && openGroupKey === entry.key;

                return (
                  <div key={entry.key} className="admin-sidebar__group">
                    {expanded ? (
                      <button
                        type="button"
                        className={cn(
                          "admin-sidebar__item",
                          "admin-sidebar__group-toggle",
                          groupActive && "is-active",
                          isOpen && "is-open",
                        )}
                        onClick={() => handleGroupToggle(entry)}
                        aria-expanded={isOpen}
                        aria-controls={`admin-subnav-${entry.key}`}
                      >
                        <span className="admin-sidebar__item-icon" aria-hidden="true">
                          <AdminNavIcon name={entry.icon} />
                        </span>
                        <span className="admin-sidebar__item-label">{t(entry.navLabelKey)}</span>
                        <GroupChevron open={isOpen} />
                      </button>
                    ) : (
                      <Link
                        href={groupHref}
                        className={cn("admin-sidebar__item", groupActive && "is-active")}
                        title={t(entry.navLabelKey)}
                        aria-current={groupActive ? "page" : undefined}
                      >
                        <span className="admin-sidebar__item-icon" aria-hidden="true">
                          <AdminNavIcon name={entry.icon} />
                        </span>
                        <span className="admin-sidebar__item-label">{t(entry.navLabelKey)}</span>
                      </Link>
                    )}

                    <div className={cn("admin-sidebar__subnav-wrap", isOpen && "is-open")}>
                      <div
                        id={`admin-subnav-${entry.key}`}
                        className="admin-sidebar__subnav"
                        aria-label={t(entry.navLabelKey)}
                      >
                        {visibleChildren.map((child) => {
                          const siblingRoutes = visibleChildren.map((item) => item.route);
                          const active = isAdminMenuPageActive(pathname, child.route, siblingRoutes);

                          return (
                            <Link
                              key={child.key}
                              href={child.route}
                              className={cn("admin-sidebar__subitem", active && "is-active")}
                              aria-current={active ? "page" : undefined}
                            >
                              <span className="admin-sidebar__subitem-icon" aria-hidden="true">
                                <AdminNavIcon name={child.icon} />
                              </span>
                              <span className="admin-sidebar__subitem-label">{t(child.navLabelKey)}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              const active = isAdminMenuPageActive(pathname, entry.route);

              if (!canViewMenuPage(entry)) {
                return null;
              }

              return (
                <Link
                  key={entry.key}
                  href={entry.route}
                  className={cn("admin-sidebar__item", active && "is-active")}
                  title={!expanded ? t(entry.navLabelKey) : undefined}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="admin-sidebar__item-icon" aria-hidden="true">
                    <AdminNavIcon name={entry.icon} />
                  </span>
                  <span className="admin-sidebar__item-label">{t(entry.navLabelKey)}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <footer className="admin-sidebar__footer">
        <Link
          href={ROUTES.home}
          className="admin-sidebar__site-link"
          title={t("backToSite")}
          aria-label={t("backToSite")}
        >
          <span className="admin-sidebar__site-link-icon" aria-hidden="true">
            <BackToWebsiteIcon />
          </span>
          <span className="admin-sidebar__site-link-copy">
            <strong>{t("backToSite")}</strong>
            <span>{t("backToSiteHint")}</span>
          </span>
        </Link>
      </footer>
    </aside>
  );
}
