"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { AdminConfirmModal } from "@/components/admin/common/AdminConfirmModal";
import { AdminTable, type AdminTableColumn } from "@/components/admin/common/AdminTable";
import { AdminTableActions } from "@/components/admin/common/AdminTableActions";
import { AdminTooltip } from "@/components/admin/common/AdminTooltip";
import { ButtonLink } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { ROUTES, teamRoleEditHref, teamRoleViewHref } from "@/lib/constants";
import {
  deleteTeamRole,
  getTeamRolesState,
  TEAM_ROLES_UPDATED_EVENT,
} from "@/lib/team-roles";
import type { TeamRole } from "@/lib/team-roles.config";

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function TeamRolesListing() {
  const t = useTranslations("admin.company.teamMembers.roles");
  const toast = useToast();
  const [roles, setRoles] = useState<TeamRole[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<TeamRole | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const sync = () => setRoles(getTeamRolesState());
    sync();

    window.addEventListener(TEAM_ROLES_UPDATED_EVENT, sync);
    return () => window.removeEventListener(TEAM_ROLES_UPDATED_EVENT, sync);
  }, []);

  async function handleDeleteConfirm() {
    if (!deleteTarget) {
      return;
    }

    setDeleteLoading(true);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 280));
      deleteTeamRole(deleteTarget.value);
      toast.success(t("delete.success.title"), t("delete.success.body"));
      setDeleteTarget(null);
    } catch {
      toast.error(t("delete.errors.title"), t("delete.errors.generic"));
    } finally {
      setDeleteLoading(false);
    }
  }

  const columns = useMemo<AdminTableColumn<TeamRole>[]>(
    () => [
      {
        key: "label",
        header: t("table.roleTitle"),
        render: (row) => (
          <AdminTooltip label={row.label} className="admin-tooltip-trigger--fit">
            <strong className="admin-table__label admin-table__cell-text">{row.label}</strong>
          </AdminTooltip>
        ),
      },
      {
        key: "value",
        header: t("table.roleKey"),
        render: (row) => (
          <AdminTooltip label={row.value} className="admin-tooltip-trigger--fit">
            <code className="admin-table__code admin-table__cell-text">{row.value}</code>
          </AdminTooltip>
        ),
      },
      {
        key: "actions",
        header: t("table.actions"),
        variant: "actions",
        render: (row) => (
          <AdminTableActions
            viewHref={teamRoleViewHref(row.value)}
            editHref={teamRoleEditHref(row.value)}
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
    <section className="admin-team-roles">
      <div className="admin-page-toolbar">
        <p className="admin-page-toolbar__meta">{t("summary", { count: roles.length })}</p>
        <ButtonLink
          href={ROUTES.admin.teamMembers.rolesCreate}
          variant="accent"
          className="admin-page-toolbar__action"
        >
          <PlusIcon />
          {t("createAction")}
        </ButtonLink>
      </div>

      <AdminTable
        columns={columns}
        rows={roles}
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
        description={t("delete.confirm.description", { roleTitle: deleteTarget?.label ?? "" })}
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
