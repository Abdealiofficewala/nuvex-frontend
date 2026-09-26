"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/buttons";
import { ROUTES, teamMemberEditHref } from "@/lib/constants";
import { findTeamMemberById } from "@/lib/team-members";
import { cn, hasValue } from "@/lib/utils";

type ViewTeamMemberDetailProps = {
  id: string;
};

export function ViewTeamMemberDetail({ id }: ViewTeamMemberDetailProps) {
  const t = useTranslations("admin.company.teams.view");
  const teamsT = useTranslations("admin.company.teams");
  const member = useMemo(() => findTeamMemberById(id), [id]);

  if (!member) {
    return (
      <div className="admin-role-view admin-role-view--empty">
        <p className="admin-role-view__empty-title">{t("notFound.title")}</p>
        <p className="admin-role-view__empty-body">{t("notFound.body")}</p>
        <ButtonLink href={ROUTES.admin.teamMembers.members} variant="secondary">
          {t("cancelAction")}
        </ButtonLink>
      </div>
    );
  }

  return (
    <section className="admin-role-view admin-member-view">
      <div className="admin-panel admin-role-view__panel">
        <div className="admin-member-view__hero">
          <span className="admin-member-view__avatar" aria-hidden="true">
            {hasValue(member.image) ? (
              member.image.startsWith("data:") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={member.image} alt="" className="admin-member-view__native-image" />
              ) : (
                <Image src={member.image} alt="" fill sizes="96px" />
              )
            ) : null}
          </span>
          <div className="admin-member-view__intro">
            <h2 className="admin-member-view__name">{member.name}</h2>
            <p className="admin-member-view__role">{member.role}</p>
          </div>
        </div>

        <dl className="admin-role-view__grid admin-member-view__grid">
          <div className="admin-role-view__item admin-role-view__item--wide">
            <dt>{t("fields.crunch")}</dt>
            <dd>{member.crunch}</dd>
          </div>
          <div className="admin-role-view__item admin-role-view__item--wide">
            <dt>{t("fields.body")}</dt>
            <dd>{member.body}</dd>
          </div>
          <div className="admin-role-view__item">
            <dt>{t("fields.phone")}</dt>
            <dd>{member.phone || "—"}</dd>
          </div>
          <div className="admin-role-view__item">
            <dt>{t("fields.email")}</dt>
            <dd>{member.email || "—"}</dd>
          </div>
          <div className="admin-role-view__item">
            <dt>{t("fields.visible")}</dt>
            <dd>
              <span
                className={cn(
                  "admin-member-view__status",
                  member.visible ? "is-visible" : "is-hidden",
                )}
              >
                <span className="admin-member-view__status-dot" aria-hidden="true" />
                {member.visible ? teamsT("options.yes") : teamsT("options.no")}
              </span>
            </dd>
          </div>
        </dl>

        <div className="admin-page-actions admin-page-actions--form">
          <ButtonLink
            href={ROUTES.admin.teamMembers.members}
            variant="secondary"
            className="admin-page-actions__btn admin-page-actions__btn--reset"
          >
            {t("cancelAction")}
          </ButtonLink>
          <ButtonLink
            href={teamMemberEditHref(member.key)}
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
