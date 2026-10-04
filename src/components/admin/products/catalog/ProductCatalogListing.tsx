"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { AdminConfirmModal } from "@/components/admin/common/AdminConfirmModal";
import { AdminFormField } from "@/components/admin/common/AdminFormField";
import { AdminFormSelect } from "@/components/admin/common/AdminFormSelect";
import { AdminListingTable } from "@/components/admin/common/AdminListingTable";
import { AdminStatusBadge } from "@/components/admin/common/AdminStatusBadge";
import type { AdminTableColumn } from "@/components/admin/common/AdminTable";
import { AdminTableActions } from "@/components/admin/common/AdminTableActions";
import { AdminTooltip } from "@/components/admin/common/AdminTooltip";
import { useToast } from "@/components/ui/toast";
import { useAdminResourceListing } from "@/lib/admin/use-admin-resource-listing";
import { ROUTES, productCatalogEditHref, productCatalogViewHref } from "@/lib/constants";
import { productCatalogData } from "@/lib/products/catalog-data";
import type { CatalogProduct, CatalogProductStatus } from "@/types/product-catalog";

export function ProductCatalogListing() {
  const t = useTranslations("admin.products.catalog.listing");
  const toast = useToast();
  const [deleteTarget, setDeleteTarget] = useState<CatalogProduct | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState("");

  const onLoadError = useCallback(() => {
    toast.error(t("errors.title"), t("errors.load"));
  }, [t, toast]);

  const { items, listLoading, refresh } = useAdminResourceListing({
    load: productCatalogData.listProducts,
    onLoadError,
  });

  const categories = useMemo(
    () => [...new Map(items.map((item) => [item.category.id, item.category])).values()],
    [items],
  );
  const types = useMemo(
    () => [...new Map(items.map((item) => [item.type.id, item.type])).values()],
    [items],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...items]
      .filter((row) => {
        if (categoryFilter && row.category.id !== categoryFilter) {
          return false;
        }
        if (typeFilter && row.type.id !== typeFilter) {
          return false;
        }
        if (statusFilter && row.status !== statusFilter) {
          return false;
        }
        if (featuredFilter === "yes" && !row.featured) {
          return false;
        }
        if (featuredFilter === "no" && row.featured) {
          return false;
        }
        if (!query) {
          return true;
        }

        const skuHaystack = row.variants.map((v) => `${v.sku} ${v.partNumber}`).join(" ");
        const haystack = `${row.name} ${row.productCode} ${row.category.name} ${row.type.name} ${skuHaystack}`.toLowerCase();
        return haystack.includes(query);
      })
      .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
  }, [categoryFilter, featuredFilter, items, search, statusFilter, typeFilter]);

  async function handleDeleteConfirm() {
    if (!deleteTarget) {
      return;
    }

    setDeleteLoading(true);
    try {
      await productCatalogData.deleteProduct(deleteTarget.id);
      toast.success(t("delete.success.title"), t("delete.success.body"));
      setDeleteTarget(null);
      await refresh();
    } catch (error) {
      toast.error(t("errors.title"), error instanceof Error ? error.message : t("errors.generic"));
    } finally {
      setDeleteLoading(false);
    }
  }

  const columns = useMemo<AdminTableColumn<CatalogProduct>[]>(
    () => [
      {
        key: "image",
        header: t("table.image"),
        align: "center",
        render: (row) => (
          <div className="appearance-branding-thumb">
            {row.media.thumbnail?.url ? (
              <Image src={row.media.thumbnail.url} alt="" width={40} height={40} unoptimized className="appearance-branding-thumb__image" />
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
        key: "productCode",
        header: t("table.productCode"),
        render: (row) => row.productCode,
      },
      {
        key: "category",
        header: t("table.category"),
        render: (row) => row.category.name,
      },
      {
        key: "type",
        header: t("table.type"),
        render: (row) => row.type.name,
      },
      {
        key: "variants",
        header: t("table.variants"),
        render: (row) => row.variants.length,
      },
      {
        key: "status",
        header: t("table.status"),
        variant: "status",
        render: (row) => (
          <AdminStatusBadge
            active={row.status === "active"}
            activeLabel={t("status.active")}
            inactiveLabel={t(`status.${row.status as CatalogProductStatus}`)}
          />
        ),
      },
      {
        key: "featured",
        header: t("table.featured"),
        render: (row) => (row.featured ? t("options.yes") : t("options.no")),
      },
      {
        key: "updatedAt",
        header: t("table.updated"),
        render: (row) => new Date(row.updatedAt).toLocaleDateString(),
      },
      {
        key: "actions",
        header: t("table.actions"),
        variant: "actions",
        render: (row) => (
          <AdminTableActions
            viewHref={productCatalogViewHref(row.id)}
            editHref={productCatalogEditHref(row.id)}
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
    <section className="admin-product-catalog-listing">
      <div className="admin-form-grid admin-form-grid--2 admin-product-catalog-listing__filters">
        <AdminFormField
          id="product-search"
          label={t("filters.search")}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t("filters.searchPlaceholder")}
        />
        <AdminFormSelect
          id="product-category-filter"
          label={t("filters.category")}
          value={categoryFilter}
          onChange={(value) => setCategoryFilter(value)}
          options={[
            { value: "", label: t("filters.all") },
            ...categories.map((category) => ({ value: category.id, label: category.name })),
          ]}
        />
        <AdminFormSelect
          id="product-type-filter"
          label={t("filters.type")}
          value={typeFilter}
          onChange={(value) => setTypeFilter(value)}
          options={[
            { value: "", label: t("filters.all") },
            ...types.map((type) => ({ value: type.id, label: type.name })),
          ]}
        />
        <AdminFormSelect
          id="product-status-filter"
          label={t("filters.status")}
          value={statusFilter}
          onChange={(value) => setStatusFilter(value)}
          options={[
            { value: "", label: t("filters.all") },
            { value: "active", label: t("status.active") },
            { value: "draft", label: t("status.draft") },
            { value: "archived", label: t("status.archived") },
          ]}
        />
        <AdminFormSelect
          id="product-featured-filter"
          label={t("filters.featured")}
          value={featuredFilter}
          onChange={(value) => setFeaturedFilter(value)}
          options={[
            { value: "", label: t("filters.all") },
            { value: "yes", label: t("options.yes") },
            { value: "no", label: t("options.no") },
          ]}
        />
      </div>

      <AdminListingTable
        columns={columns}
        rows={filtered}
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
        onConfirm={() => void handleDeleteConfirm()}
        onCancel={() => {
          if (!deleteLoading) {
            setDeleteTarget(null);
          }
        }}
      />
    </section>
  );
}
