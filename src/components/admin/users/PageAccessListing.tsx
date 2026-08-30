"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { AdminConfirmModal } from "@/components/admin/common/AdminConfirmModal";
import { AdminTable, AdminTableCheckbox, type AdminTableColumn } from "@/components/admin/common";
import { AdminTableActions } from "@/components/admin/common/AdminTableActions";
import { AdminTooltip } from "@/components/admin/common/AdminTooltip";
import { ButtonLink } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  ADMIN_PAGE_PERMISSIONS,
  userHasPermission,
  type AdminUserPageAccess,
} from "@/lib/admin-page-access.config";
import {
  ADMIN_USERS_UPDATED_EVENT,
  deleteAdminPageAccess,
  getAdminUserFullName,
  getAdminUserPageAccess,
  getAdminUserPhone,
  getAdminUsers,
  type AdminUserRecord,
} from "@/lib/admin-users";
import {
  ROUTES,
  adminPageAccessEditHref,
  adminPageAccessViewHref,
} from "@/lib/constants";
import { cn, hasValue, initials } from "@/lib/utils";

type AccessListingRow = AdminUserRecord & {
  access: AdminUserPageAccess;
};

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function PageAccessListing() {
  const t = useTranslations("admin.users.access.listing");
  const toast = useToast();
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<AdminUserRecord | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  function syncUsers() {
    setUsers(getAdminUsers());
  }

  useEffect(() => {
    syncUsers();
    window.addEventListener(ADMIN_USERS_UPDATED_EVENT, syncUsers);
    return () => window.removeEventListener(ADMIN_USERS_UPDATED_EVENT, syncUsers);
  }, []);

  async function handleDeleteConfirm() {
    if (!deleteTarget) {
      return;
    }

    setDeleteLoading(true);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 280));
      deleteAdminPageAccess(deleteTarget.id);
      toast.success(t("delete.success.title"), t("delete.success.body"));
      setDeleteTarget(null);
    } catch {
      toast.error(t("delete.errors.title"), t("delete.errors.generic"));
    } finally {
      setDeleteLoading(false);
    }
  }

  const rows = useMemo<AccessListingRow[]>(
    () =>
      users.map((user) => ({
        ...user,
        access: getAdminUserPageAccess(user.id),
      })),
    [users],
  );

  const columns = useMemo<AdminTableColumn<AccessListingRow>[]>(
    () => [
      {
        key: "name",
        header: t("table.name"),
        variant: "member",
        render: (row) => {
          const name = getAdminUserFullName(row);

          return (
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
                  <span className="admin-table-member__initials">{initials(name || row.email)}</span>
                )}
              </span>
              <AdminTooltip label={name || row.email} className="admin-tooltip-trigger--fit">
                <strong className="admin-table__label admin-table__cell-text">{name || row.email}</strong>
              </AdminTooltip>
            </div>
          );
        },
      },
      {
        key: "email",
        header: t("table.email"),
        variant: "email",
        render: (row) => (
          <AdminTooltip label={row.email} className="admin-tooltip-trigger--fit">
            <span className="admin-table__label admin-table__cell-text">{row.email}</span>
          </AdminTooltip>
        ),
      },
      {
        key: "phone",
        header: t("table.phone"),
        variant: "phone",
        render: (row) => {
          const phone = getAdminUserPhone(row);

          return phone ? (
            <AdminTooltip label={phone} className="admin-tooltip-trigger--fit">
              <span className="admin-table__label admin-table__cell-text">{phone}</span>
            </AdminTooltip>
          ) : (
            <span className="admin-table__muted">—</span>
          );
        },
      },
      {
        key: "role",
        header: t("table.role"),
        variant: "role",
        render: (row) => {
          const roleLabel = t(`roles.${row.role}`);

          return (
            <AdminTooltip label={roleLabel} className="admin-tooltip-trigger--fit">
              <span className={cn("admin-table-role", `admin-table-role--${row.role}`)}>
                <span className="admin-table-role__dot" aria-hidden="true" />
                <span className="admin-table-role__text">{roleLabel}</span>
              </span>
            </AdminTooltip>
          );
        },
      },
      ...ADMIN_PAGE_PERMISSIONS.map((permission) => ({
        key: permission,
        header: t(`permissions.${permission}`),
        variant: "checkbox" as const,
        render: (row: AccessListingRow) => (
          <AdminTableCheckbox
            checked={userHasPermission(row.access, permission)}
            label={`${getAdminUserFullName(row) || row.email} · ${t(`permissions.${permission}`)}`}
          />
        ),
      })),
      {
        key: "actions",
        header: t("table.actions"),
        variant: "actions",
        render: (row) => (
          <AdminTableActions
            viewHref={adminPageAccessViewHref(row.id)}
            editHref={adminPageAccessEditHref(row.id)}
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
    <section className="admin-access-listing">
      <div className="admin-page-toolbar">
        <p className="admin-page-toolbar__meta">{t("summary", { count: users.length })}</p>
        <ButtonLink
          href={ROUTES.admin.users.accessCreate}
          variant="accent"
          className="admin-page-toolbar__action"
        >
          <PlusIcon />
          {t("addAction")}
        </ButtonLink>
      </div>

      <AdminTable
        columns={columns}
        rows={rows}
        rowKey={(row) => row.id}
        emptyTitle={t("empty.title")}
        emptyDescription={t("empty.body")}
      />

      <AdminConfirmModal
        open={Boolean(deleteTarget)}
        title={t("delete.confirm.title")}
        description={t("delete.confirm.description", {
          name: deleteTarget ? getAdminUserFullName(deleteTarget) || deleteTarget.email : "",
        })}
        confirmLabel={t("delete.confirm.confirm")}
        tone="caution"
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
