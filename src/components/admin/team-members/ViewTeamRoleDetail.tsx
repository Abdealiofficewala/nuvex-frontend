"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/buttons";
import { ROUTES, teamRoleEditHref } from "@/lib/constants";
import { findTeamRoleByValue } from "@/lib/team-roles";

type ViewTeamRoleDetailProps = {
  value: string;
};

export function ViewTeamRoleDetail({ value }: ViewTeamRoleDetailProps) {
  const t = useTranslations("admin.company.teamMembers.roles.view");
  const role = useMemo(() => findTeamRoleByValue(value), [value]);

  if (!role) {
    return (
      <div className="admin-role-view admin-role-view--empty">
        <p className="admin-role-view__empty-title">{t("notFound.title")}</p>
        <p className="admin-role-view__empty-body">{t("notFound.body")}</p>
        <ButtonLink href={ROUTES.admin.teamMembers.roles} variant="secondary">
          {t("cancelAction")}
        </ButtonLink>
      </div>
    );
  }

  return (
    <section className="admin-role-view">
      <div className="admin-panel admin-role-view__panel">
        <dl className="admin-role-view__grid">
          <div className="admin-role-view__item">
            <dt>{t("fields.roleTitle")}</dt>
            <dd>{role.label}</dd>
          </div>
          <div className="admin-role-view__item">
            <dt>{t("fields.roleKey")}</dt>
            <dd>
              <code className="admin-table__code">{role.value}</code>
            </dd>
          </div>
        </dl>

        <div className="admin-page-actions admin-page-actions--form">
          <ButtonLink
            href={ROUTES.admin.teamMembers.roles}
            variant="secondary"
            className="admin-page-actions__btn admin-page-actions__btn--reset"
          >
            {t("cancelAction")}
          </ButtonLink>
          <ButtonLink
            href={teamRoleEditHref(role.value)}
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
