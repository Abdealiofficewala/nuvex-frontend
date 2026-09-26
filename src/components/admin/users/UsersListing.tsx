"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { AdminConfirmModal } from "@/components/admin/common/AdminConfirmModal";
import { AdminListingTable } from "@/components/admin/common/AdminListingTable";
import type { AdminTableColumn } from "@/components/admin/common/AdminTable";
import { AdminTableActions } from "@/components/admin/common/AdminTableActions";
import { AdminTooltip } from "@/components/admin/common/AdminTooltip";
import { useToast } from "@/components/ui/toast";
import {
  ADMIN_USERS_UPDATED_EVENT,
  deleteAdminUser,
  getAdminUserFullName,
  getAdminUserPhone,
  getAdminUsers,
  type AdminUserRecord,
} from "@/lib/admin-users";
import { ROUTES, adminUserViewHref } from "@/lib/constants";
import { cn, hasValue, initials } from "@/lib/utils";

export function UsersListing() {
  const t = useTranslations("admin.users.listing");
  const toast = useToast();
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<AdminUserRecord | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const sync = () => setUsers(getAdminUsers());
    sync();

    window.addEventListener(ADMIN_USERS_UPDATED_EVENT, sync);
    return () => window.removeEventListener(ADMIN_USERS_UPDATED_EVENT, sync);
  }, []);

  async function handleDeleteConfirm() {
    if (!deleteTarget) {
      return;
    }

    setDeleteLoading(true);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 280));
      deleteAdminUser(deleteTarget.id);
      toast.success(t("delete.success.title"), t("delete.success.body"));
      setDeleteTarget(null);
    } catch {
      toast.error(t("delete.errors.title"), t("delete.errors.generic"));
    } finally {
      setDeleteLoading(false);
    }
  }

  const columns = useMemo<AdminTableColumn<AdminUserRecord>[]>(
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
        key: "designation",
        header: t("table.designation"),
        variant: "designation",
        render: (row) =>
          row.designation ? (
            <AdminTooltip label={row.designation} className="admin-tooltip-trigger--fit">
              <span className="admin-table__cell-text">{row.designation}</span>
            </AdminTooltip>
          ) : (
            <span className="admin-table__muted">—</span>
          ),
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
      {
        key: "active",
        header: t("table.active"),
        variant: "status",
        render: (row) => (
          <span className={cn("admin-table-badge", row.active ? "is-visible" : "is-hidden")}>
            {row.active ? t("status.active") : t("status.inactive")}
          </span>
        ),
      },
      {
        key: "actions",
        header: t("table.actions"),
        variant: "actions",
        render: (row) => (
          <AdminTableActions
            viewHref={adminUserViewHref(row.id)}
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
    <section className="admin-users-listing">
      <AdminListingTable
        columns={columns}
        rows={users}
        rowKey={(row) => row.id}
        toolbarTitle={t("toolbarTitle")}
        createHref={ROUTES.admin.users.create}
        createLabel={t("addAction")}
      />

      <AdminConfirmModal
        open={Boolean(deleteTarget)}
        title={t("delete.confirm.title")}
        description={t("delete.confirm.description", {
          name: deleteTarget ? getAdminUserFullName(deleteTarget) : "",
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
