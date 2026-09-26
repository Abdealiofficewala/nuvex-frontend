"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { AdminConfirmModal } from "@/components/admin/common/AdminConfirmModal";
import {
  AdminListingFilterModal,
  type AdminListingFilterField,
} from "@/components/admin/common/AdminListingFilterModal";
import { AdminListingFilterTrigger } from "@/components/admin/common/AdminListingFilterTrigger";
import { AdminListingTable } from "@/components/admin/common/AdminListingTable";
import { AdminStatusBadge } from "@/components/admin/common/AdminStatusBadge";
import type { AdminTableColumn } from "@/components/admin/common/AdminTable";
import { AdminTableActions } from "@/components/admin/common/AdminTableActions";
import { AdminTooltip } from "@/components/admin/common/AdminTooltip";
import { ButtonLink } from "@/components/ui/buttons";
import { useToast } from "@/components/ui/toast";
import { countActiveListingFilters } from "@/lib/admin/listing-filters";
import { useAdminResourceListing } from "@/lib/admin/use-admin-resource-listing";
import { ROUTES, typeEditHref, typeViewHref } from "@/lib/constants";
import { contentService } from "@/services/content.service";
import type { ProductTypeRecord } from "@/types/content-admin";

type VisibleFilter = "all" | "visible" | "hidden";

function CreateIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function TypesListing() {
  const t = useTranslations("admin.products.types");
  const toast = useToast();
  const [deleteTarget, setDeleteTarget] = useState<ProductTypeRecord | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [visibleFilter, setVisibleFilter] = useState<VisibleFilter>("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const onLoadError = useCallback(() => {
    toast.error(t("errors.title"), t("errors.load"));
  }, [t, toast]);

  const { items, listLoading, refresh } = useAdminResourceListing({
    load: contentService.listProductTypes,
    onLoadError,
  });

  const filterFields = useMemo<AdminListingFilterField[]>(
    () => [
      {
        id: "visible",
        label: t("filters.visible"),
        value: visibleFilter,
        defaultValue: "all",
        options: [
          { value: "all", label: t("filters.allVisible") },
          { value: "visible", label: t("filters.visibleOnly") },
          { value: "hidden", label: t("filters.hiddenOnly") },
        ],
      },
    ],
    [t, visibleFilter],
  );

  const activeFilterCount = countActiveListingFilters(filterFields);

  const rows = useMemo(() => {
    if (visibleFilter === "visible") {
      return items.filter((item) => item.isVisible !== false);
    }

    if (visibleFilter === "hidden") {
      return items.filter((item) => item.isVisible === false);
    }

    return items;
  }, [items, visibleFilter]);

  async function handleDeleteConfirm() {
    if (!deleteTarget) {
      return;
    }

    setDeleteLoading(true);

    try {
      await contentService.deleteProductType(deleteTarget.id);
      toast.success(t("delete.success.title"), t("delete.success.body"));
      setDeleteTarget(null);
      await refresh();
    } catch (error) {
      toast.error(t("errors.title"), error instanceof Error ? error.message : t("errors.generic"));
    } finally {
      setDeleteLoading(false);
    }
  }

  const columns = useMemo<AdminTableColumn<ProductTypeRecord>[]>(
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
        key: "summary",
        header: t("table.summary"),
        render: (row) => (
          <AdminTooltip label={row.summary || "—"} className="admin-tooltip-trigger--fit">
            <span className="admin-table__cell-text">{row.summary || "—"}</span>
          </AdminTooltip>
        ),
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
        key: "actions",
        header: t("table.actions"),
        variant: "actions",
        render: (row) => (
          <AdminTableActions
            viewHref={typeViewHref(row.id)}
            editHref={typeEditHref(row.id)}
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
    <section className="admin-types-listing">
      <AdminListingTable
        columns={columns}
        rows={rows}
        rowKey={(row) => row.id}
        caption={t("table.caption")}
        loading={listLoading}
        toolbarTitle={t("toolbarTitle")}
        createHref={ROUTES.admin.products.typesCreate}
        createLabel={t("createAction")}
        toolbarAction={
          <div className="admin-table-panel__toolbar-actions">
            <AdminListingFilterTrigger
              activeCount={activeFilterCount}
              onClick={() => setFilterOpen(true)}
            />
            <ButtonLink href={ROUTES.admin.products.typesCreate} variant="accent" className="admin-page-toolbar__action">
              <CreateIcon />
              {t("createAction")}
            </ButtonLink>
          </div>
        }
      />

      <AdminListingFilterModal
        open={filterOpen}
        title={t("filters.modalTitle")}
        description={t("filters.modalDescription")}
        fields={filterFields}
        onApply={(values) => {
          setVisibleFilter((values.visible as VisibleFilter) ?? "all");
          setFilterOpen(false);
        }}
        onClose={() => setFilterOpen(false)}
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
