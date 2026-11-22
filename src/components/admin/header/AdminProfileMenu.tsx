"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { LogoutIcon } from "@/components/admin/dashboard/DashboardIcons";
import { ChevronDownIcon } from "@/components/admin/header/AdminMenuIcons";
import { useAdminDropdown } from "@/components/admin/header/useAdminDropdown";
import { Link, useRouter } from "@/i18n/routing";
import { ADMIN_AUTH, ROUTES } from "@/lib/constants";
import {
  clearAdminSession,
  getAdminDisplayName,
  getAdminInitials,
  getAdminUserEmail,
} from "@/lib/admin-session";
import { resolveAdminUserRole, type AdminUserRole } from "@/lib/admin-users";
import { cn } from "@/lib/utils";

export function AdminProfileMenu() {
  const t = useTranslations("admin.header");
  const router = useRouter();
  const { rootRef, open, toggle, close } = useAdminDropdown();
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<AdminUserRole>("admin");

  useEffect(() => {
    const sessionEmail = getAdminUserEmail() ?? ADMIN_AUTH.demoEmail;
    setEmail(sessionEmail);
    setRole(resolveAdminUserRole(sessionEmail));
  }, []);

  const displayEmail = email ?? ADMIN_AUTH.demoEmail;
  const displayName = getAdminDisplayName(displayEmail);
  const initials = getAdminInitials(displayEmail);

  const signOut = () => {
    close();
    clearAdminSession();
    router.replace(ROUTES.admin.login);
  };

  return (
    <div ref={rootRef} className={cn("admin-menu", "admin-menu--user", open && "is-open")}>
      <button
        type="button"
        className="admin-menu__btn admin-menu__btn--user"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={toggle}
      >
        <span className="admin-menu__avatar-wrap">
          <span className="admin-menu__avatar">{initials}</span>
          <span className="admin-menu__avatar-dot" aria-hidden="true" />
        </span>
        <span className="admin-menu__btn-text">{displayName}</span>
        <ChevronDownIcon className="admin-menu__btn-chevron" />
      </button>

      {open ? (
        <div className="admin-menu__pop admin-menu__pop--user" role="menu">
          <div className="admin-menu__user-hero">
            <span className="admin-menu__avatar admin-menu__avatar--lg">{initials}</span>
            <div className="admin-menu__user-meta">
              <Link
                href={ROUTES.admin.users.profile}
                className="admin-menu__user-profile"
                onClick={close}
              >
                <strong>{displayName}</strong>
                <span className={cn("admin-role-badge", `admin-role-badge--${role}`)}>
                  {t(`rolesShort.${role}`)}
                </span>
              </Link>
              <span className="admin-menu__user-email">{displayEmail}</span>
            </div>
          </div>

          <div className="admin-menu__pop-body">
            <button type="button" className="admin-menu__signout" role="menuitem" onClick={signOut}>
              <span className="admin-menu__signout-icon">
                <LogoutIcon />
              </span>
              <span className="admin-menu__signout-copy">
                <strong>{t("signOut")}</strong>
                <span>{t("signOutHint")}</span>
              </span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
