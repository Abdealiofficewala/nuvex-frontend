"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/buttons";
import {
  PermissionCoverageSummary,
  PermissionMatrix,
} from "@/components/admin/user-management/PermissionMatrix";
import { AdminStatusBadge } from "@/components/admin/common/AdminStatusBadge";
import { summarizeRolePermissions } from "@/lib/admin-role-permissions";
import { findAdminRoleById, type AdminRoleRecord } from "@/lib/admin-roles";
import { countAdminUsersWithRole } from "@/lib/admin-users";
import { ROUTES, adminRoleEditHref } from "@/lib/constants";
import { capitalizeFieldText } from "@/lib/utils";

type ViewRoleDetailProps = {
  id: string;
};

function formatRoleDate(value: string, locale: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function ViewRoleDetail({ id }: ViewRoleDetailProps) {
  const t = useTranslations("admin.users.roles.view");
  const tForm = useTranslations("admin.users.roles.edit");
  const tAccess = useTranslations("admin.users.access");
  const locale = useLocale();
  const [role, setRole] = useState<AdminRoleRecord | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setRole(findAdminRoleById(id) ?? null);
    setLoaded(true);
  }, [id]);

  const summary = useMemo(
    () => (role ? summarizeRolePermissions(role.permissions) : null),
    [role],
  );

  if (!loaded) {
    return (
      <div className="admin-um-role-view admin-um-role-view--loading" aria-busy="true">
        <div className="admin-um-role-view__skeleton" />
      </div>
    );
  }

  if (!role) {
    return (
      <div className="admin-role-view admin-role-view--empty admin-um-role-view--empty">
        <p className="admin-role-view__empty-title">{t("notFound.title")}</p>
        <p className="admin-role-view__empty-body">{t("notFound.body")}</p>
        <ButtonLink href={ROUTES.admin.users.roles} variant="secondary">
          {t("cancelAction")}
        </ButtonLink>
      </div>
    );
  }

  const userCount = countAdminUsersWithRole(role.id);

  return (
    <section className="admin-um-role-view">
      <div className="admin-um-role-view__card">
        <aside className="admin-um-role-view__aside">
          <h2 className="admin-um-role-view__name">{capitalizeFieldText(role.name)}</h2>
          <p className="admin-um-role-view__description">
            {role.description ? capitalizeFieldText(role.description) : "—"}
          </p>
          <AdminStatusBadge
            active={role.active}
            activeLabel={t("status.active")}
            inactiveLabel={t("status.inactive")}
          />
          <dl className="admin-um-role-view__meta">
            <div>
              <dt>{t("meta.users")}</dt>
              <dd>{userCount}</dd>
            </div>
            <div>
              <dt>{t("meta.updated")}</dt>
              <dd>{formatRoleDate(role.updatedAt, locale)}</dd>
            </div>
          </dl>
          {summary ? (
            <PermissionCoverageSummary
              className="admin-um-role-view__coverage"
              summary={summary}
              t={tAccess}
              variant="sidebar"
            />
          ) : null}
          <ButtonLink
            href={adminRoleEditHref(role.id)}
            variant="accent"
            className="admin-um-role-view__edit"
          >
            {t("editAction")}
          </ButtonLink>
        </aside>

        <div className="admin-um-role-view__main">
          <header className="admin-um-role-view__main-head">
            <h3>{tForm("sections.permissions")}</h3>
          </header>
          <PermissionMatrix value={role.permissions} readOnly showCoverageSummary={false} />
        </div>
      </div>

      <footer className="admin-um-role-view__footer">
        <ButtonLink href={ROUTES.admin.users.roles} variant="secondary">
          {t("cancelAction")}
        </ButtonLink>
      </footer>
    </section>
  );
}
