"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { AdminConfirmModal } from "@/components/admin/common/AdminConfirmModal";
import { AdminListingTable } from "@/components/admin/common/AdminListingTable";
import { AdminStatusBadge } from "@/components/admin/common/AdminStatusBadge";
import type { AdminTableColumn } from "@/components/admin/common/AdminTable";
import { AdminTableActions } from "@/components/admin/common/AdminTableActions";
import { AdminTooltip } from "@/components/admin/common/AdminTooltip";
import { useToast } from "@/components/ui/toast";
import { useAdminResourceListing } from "@/lib/admin/use-admin-resource-listing";
import { ROUTES, productEditHref, productViewHref } from "@/lib/constants";
import { contentService } from "@/services/content.service";
import type { ProductRecord } from "@/types/content-admin";

export function ProductsListing() {
  const t = useTranslations("admin.products.listing");
  const toast = useToast();
  const [deleteTarget, setDeleteTarget] = useState<ProductRecord | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const onLoadError = useCallback(() => {
    toast.error(t("errors.title"), t("errors.load"));
  }, [t, toast]);

  const { items, listLoading, refresh } = useAdminResourceListing({
    load: contentService.listProducts,
    onLoadError,
  });

  async function handleDeleteConfirm() {
    if (!deleteTarget) {
      return;
    }

    setDeleteLoading(true);

    try {
      await contentService.deleteProduct(deleteTarget.id);
      toast.success(t("delete.success.title"), t("delete.success.body"));
      setDeleteTarget(null);
      await refresh();
    } catch (error) {
      toast.error(t("errors.title"), error instanceof Error ? error.message : t("errors.generic"));
    } finally {
      setDeleteLoading(false);
    }
  }

  const columns = useMemo<AdminTableColumn<ProductRecord>[]>(
    () => [
      {
        key: "image",
        header: t("table.image"),
        align: "center",
        render: (row) => (
          <div className="appearance-branding-thumb">
            {row.image ? (
              <Image src={row.image} alt="" width={40} height={40} unoptimized className="appearance-branding-thumb__image" />
            ) : null}
          </div>
        ),
      },
      {
        key: "name",
        header: t("table.name"),
        variant: "member",
        render: (row) => (
          <AdminTooltip label={row.name} className="admin-tooltip-trigger--fit">
            <strong className="admin-table__label admin-table__cell-text">{row.name}</strong>
          </AdminTooltip>
        ),
      },
      {
        key: "category",
        header: t("table.category"),
        render: (row) => row.category,
      },
      {
        key: "status",
        header: t("table.status"),
        variant: "status",
        render: (row) => (
          <AdminStatusBadge
            active={row.status === "active"}
            activeLabel={t("status.active")}
            inactiveLabel={t(`status.${row.status}`)}
          />
        ),
      },
      {
        key: "actions",
        header: t("table.actions"),
        variant: "actions",
        render: (row) => (
          <AdminTableActions
            viewHref={productViewHref(row.id)}
            editHref={productEditHref(row.id)}
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
    <section className="admin-products-listing">
      <AdminListingTable
        columns={columns}
        rows={items}
        rowKey={(row) => row.id}
        caption={t("table.caption")}
        loading={listLoading}
        toolbarTitle={t("toolbarTitle")}
        createHref={ROUTES.admin.products.create}
        createLabel={t("createAction")}
      />

      <AdminConfirmModal
        open={Boolean(deleteTarget)}
        tone="caution"
        icon="hide"
        title={t("delete.confirm.title")}
        description={t("delete.confirm.description", { name: deleteTarget?.name ?? "" })}
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
