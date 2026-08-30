"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { AdminConfirmModal } from "@/components/admin/common/AdminConfirmModal";
import { AdminTable, type AdminTableColumn } from "@/components/admin/common/AdminTable";
import { AdminTableActions } from "@/components/admin/common/AdminTableActions";
import { AdminTooltip } from "@/components/admin/common/AdminTooltip";
import { ButtonLink } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { ROUTES, teamMemberEditHref, teamMemberViewHref } from "@/lib/constants";
import {
  deleteTeamMember,
  getTeamMembersState,
  TEAM_MEMBERS_UPDATED_EVENT,
} from "@/lib/team-members";
import type { TeamMember } from "@/lib/team-members.config";
import { cn, hasValue, initials } from "@/lib/utils";

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function TeamMembersListing() {
  const t = useTranslations("admin.company.teams");
  const toast = useToast();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const sync = () => setMembers(getTeamMembersState());
    sync();

    window.addEventListener(TEAM_MEMBERS_UPDATED_EVENT, sync);
    return () => window.removeEventListener(TEAM_MEMBERS_UPDATED_EVENT, sync);
  }, []);

  async function handleDeleteConfirm() {
    if (!deleteTarget) {
      return;
    }

    setDeleteLoading(true);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 280));
      deleteTeamMember(deleteTarget.key);
      toast.success(t("delete.success.title"), t("delete.success.body"));
      setDeleteTarget(null);
    } catch {
      toast.error(t("delete.errors.title"), t("delete.errors.generic"));
    } finally {
      setDeleteLoading(false);
    }
  }

  const columns = useMemo<AdminTableColumn<TeamMember>[]>(
    () => [
      {
        key: "name",
        header: t("table.name"),
        variant: "member",
        render: (row) => (
          <div className="admin-table-member">
            <span className="admin-table-member__avatar" aria-hidden="true">
              {hasValue(row.image) ? (
                row.image.startsWith("data:") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={row.image} alt="" className="admin-table-member__native-image" />
                ) : (
                  <Image src={row.image} alt="" fill sizes="40px" />
                )
              ) : (
                <span className="admin-table-member__initials">{initials(row.name)}</span>
              )}
            </span>
            <AdminTooltip label={row.name} className="admin-tooltip-trigger--fit">
              <strong className="admin-table__label admin-table__cell-text">{row.name}</strong>
            </AdminTooltip>
          </div>
        ),
      },
      {
        key: "description",
        header: t("table.description"),
        variant: "description",
        render: (row) => (
          <AdminTooltip label={row.crunch} className="admin-tooltip-trigger--fit">
            <span className="admin-table__description admin-table__cell-text">{row.crunch}</span>
          </AdminTooltip>
        ),
      },
      {
        key: "role",
        header: t("table.role"),
        variant: "role",
        render: (row) => (
          <AdminTooltip label={row.role} className="admin-tooltip-trigger--fit">
            <span className="admin-table-role">
              <span className="admin-table-role__dot" aria-hidden="true" />
              <span className="admin-table-role__text">{row.role}</span>
            </span>
          </AdminTooltip>
        ),
      },
      {
        key: "phone",
        header: t("table.phone"),
        variant: "phone",
        render: (row) =>
          row.phone ? (
            <AdminTooltip label={row.phone} className="admin-tooltip-trigger--fit">
              <span className="admin-table__label admin-table__cell-text">{row.phone}</span>
            </AdminTooltip>
          ) : (
            <span className="admin-table__muted">—</span>
          ),
      },
      {
        key: "email",
        header: t("table.email"),
        variant: "email",
        render: (row) =>
          row.email ? (
            <AdminTooltip label={row.email} className="admin-tooltip-trigger--fit">
              <span className="admin-table__label admin-table__cell-text">{row.email}</span>
            </AdminTooltip>
          ) : (
            <span className="admin-table__muted">—</span>
          ),
      },
      {
        key: "status",
        header: t("table.status"),
        variant: "status",
        render: (row) => (
          <span className={cn("admin-table-badge", row.visible ? "is-visible" : "is-hidden")}>
            {row.visible ? t("status.visible") : t("status.hidden")}
          </span>
        ),
      },
      {
        key: "actions",
        header: t("table.actions"),
        variant: "actions",
        render: (row) => (
          <AdminTableActions
            viewHref={teamMemberViewHref(row.key)}
            editHref={teamMemberEditHref(row.key)}
            viewLabel={t("actions.view")}
            editLabel={t("actions.edit")}
            deleteLabel={t("actions.delete")}
            onDelete={() => setDeleteTarget(row)}
          />
        ),
      },
    ],
    [t],
  );

  return (
    <section className="admin-team-members">
      <div className="admin-page-toolbar">
        <p className="admin-page-toolbar__meta">{t("summary", { count: members.length })}</p>
        <ButtonLink
          href={ROUTES.admin.teamMembers.membersCreate}
          variant="accent"
          className="admin-page-toolbar__action"
        >
          <PlusIcon />
          {t("createAction")}
        </ButtonLink>
      </div>

      <AdminTable
        columns={columns}
        rows={members}
        rowKey={(row) => row.id}
        caption={t("table.caption")}
        emptyTitle={t("empty.title")}
        emptyDescription={t("empty.body")}
      />

      <AdminConfirmModal
        open={Boolean(deleteTarget)}
        tone="caution"
        icon="hide"
        title={t("delete.confirm.title")}
        description={t("delete.confirm.description", { memberName: deleteTarget?.name ?? "" })}
        confirmLabel={t("delete.confirm.confirm")}
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          if (!deleteLoading) {
            setDeleteTarget(null);
          }
        }}
      />
    </section>
  );
}
