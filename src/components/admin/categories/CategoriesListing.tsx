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
import { ROUTES, categoryEditHref, categoryViewHref } from "@/lib/constants";
import { formatCategoryTypeDependencies } from "@/lib/product-type-utils";
import { contentService } from "@/services/content.service";
import type { CategoryRecord } from "@/types/content-admin";

export function CategoriesListing() {
  const t = useTranslations("admin.products.categories");
  const tNav = useTranslations("admin.nav");
  const typeLabel = tNav("productTypes");
  const toast = useToast();
  const [deleteTarget, setDeleteTarget] = useState<CategoryRecord | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const onLoadError = useCallback(() => {
    toast.error(t("errors.title"), t("errors.load"));
  }, [t, toast]);

  const { items, listLoading, refresh } = useAdminResourceListing({
    load: contentService.listCategories,
    onLoadError,
  });

  async function handleDeleteConfirm() {
    if (!deleteTarget) {
      return;
    }

    setDeleteLoading(true);

    try {
      await contentService.deleteCategory(deleteTarget.id);
      toast.success(t("delete.success.title"), t("delete.success.body"));
      setDeleteTarget(null);
      await refresh();
    } catch (error) {
      toast.error(t("errors.title"), error instanceof Error ? error.message : t("errors.generic"));
    } finally {
      setDeleteLoading(false);
    }
  }

  const columns = useMemo<AdminTableColumn<CategoryRecord>[]>(
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
        render: (row) => (
          <AdminTooltip label={row.name} className="admin-tooltip-trigger--fit">
            <strong className="admin-table__label admin-table__cell-text">{row.name}</strong>
          </AdminTooltip>
        ),
      },
      {
        key: "slug",
        header: t("table.slug"),
        render: (row) => (
          <AdminTooltip label={row.slug} className="admin-tooltip-trigger--fit">
            <code className="admin-table__code admin-table__cell-text">{row.slug}</code>
          </AdminTooltip>
        ),
      },
      {
        key: "types",
        header: typeLabel,
        render: (row) => {
          const label = formatCategoryTypeDependencies(row);
          return (
            <AdminTooltip label={label} className="admin-tooltip-trigger--fit">
              <span className="admin-table__cell-text">{label}</span>
            </AdminTooltip>
          );
        },
      },
      {
        key: "isVisible",
        header: t("table.visible"),
        variant: "status",
        render: (row) => (
          <AdminStatusBadge
            active={row.isVisible !== false}
            activeLabel={t("options.yes")}
            inactiveLabel={t("options.no")}
          />
        ),
      },
      {
        key: "isNew",
        header: t("table.isNew"),
        variant: "status",
        render: (row) => (
          <AdminStatusBadge
            active={row.isNew === true}
            activeLabel={t("options.yes")}
            inactiveLabel={t("options.no")}
          />
        ),
      },
      {
        key: "actions",
        header: t("table.actions"),
        variant: "actions",
        render: (row) => (
          <AdminTableActions
            viewHref={categoryViewHref(row.id)}
            editHref={categoryEditHref(row.id)}
            viewLabel={t("actions.view")}
            editLabel={t("actions.edit")}
            deleteLabel={t("actions.delete")}
            onDelete={() => setDeleteTarget(row)}
          />
        ),
      },
    ],
    [t, typeLabel],
  );

  return (
    <section className="admin-categories-listing">
      <AdminListingTable
        columns={columns}
        rows={items}
        rowKey={(row) => row.id}
        caption={t("table.caption")}
        loading={listLoading}
        toolbarTitle={t("toolbarTitle")}
        createHref={ROUTES.admin.products.categoriesCreate}
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
