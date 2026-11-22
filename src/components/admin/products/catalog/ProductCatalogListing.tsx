"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  AdminConfirmModal,
  AdminListingTable,
  AdminStatusBadge,
} from "@/components/admin/common";
import type { AdminTableColumn } from "@/components/admin/common/AdminTable";
import { AdminTableActions } from "@/components/admin/common/AdminTableActions";
import { AdminTooltip } from "@/components/admin/common/AdminTooltip";
import { ProductFilterModal } from "@/components/admin/products/ProductFilterModal";
import { useToast } from "@/components/ui/toast";
import { useAdminResourceListing } from "@/lib/admin/use-admin-resource-listing";
import { ROUTES, productCatalogEditHref, productCatalogViewHref } from "@/lib/constants";
import { productCatalogData } from "@/lib/products/catalog-data";
import {
  countActiveProductFilters,
  EMPTY_PRODUCT_LISTING_FILTERS,
  filterCatalogProducts,
  type ProductListingFilters,
  sanitizeProductListingFilters,
  sortCatalogProducts,
} from "@/lib/products/product-listing-filters";
import { getCatalogStore } from "@/lib/products/store";
import { cn, hasValue, initials } from "@/lib/utils";
import type { CatalogProduct, CatalogProductStatus } from "@/types/product-catalog";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6h16M7 12h10M10 18h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ProductCatalogListing() {
  const t = useTranslations("admin.products.catalog.listing");
  const toast = useToast();
  const [deleteTarget, setDeleteTarget] = useState<CatalogProduct | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<ProductListingFilters>(EMPTY_PRODUCT_LISTING_FILTERS);
  const [draftFilters, setDraftFilters] = useState<ProductListingFilters>(EMPTY_PRODUCT_LISTING_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);

  const onLoadError = useCallback(() => {
    toast.error(t("errors.title"), t("errors.load"));
  }, [t, toast]);

  const { items, listLoading, refresh } = useAdminResourceListing({
    load: productCatalogData.listProducts,
    onLoadError,
  });

  useEffect(() => {
    if (filterOpen) {
      setDraftFilters(filters);
    }
  }, [filterOpen, filters]);

  const activeFilterCount = useMemo(() => countActiveProductFilters(filters), [filters]);
  const draftFilterCount = useMemo(() => countActiveProductFilters(draftFilters), [draftFilters]);

  const filtered = useMemo(() => {
    const matched = filterCatalogProducts(items, search, filters);
    return sortCatalogProducts(matched, "name");
  }, [filters, items, search]);

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
        key: "product",
        header: t("table.name"),
        variant: "member",
        render: (row) => (
          <div className="admin-table-member">
            <span className="admin-table-member__avatar" aria-hidden="true">
              {hasValue(row.media.thumbnail?.url) ? (
                row.media.thumbnail!.url.startsWith("data:") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={row.media.thumbnail!.url}
                    alt=""
                    className="admin-table-member__native-image"
                  />
                ) : (
                  <Image src={row.media.thumbnail!.url} alt="" fill sizes="40px" unoptimized />
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
    <section className="admin-product-catalog-listing admin-um-listing">
      <div className="admin-um-toolbar admin-um-toolbar--users">
        <div className="admin-um-toolbar__row">
          <label className="admin-um-toolbar__search">
            <span className="admin-um-toolbar__search-icon">
              <SearchIcon />
            </span>
            <span className="sr-only">{t("search.label")}</span>
            <input
              type="search"
              className="admin-um-toolbar__search-input"
              value={search}
              placeholder={t("search.placeholder")}
              onChange={(event) => setSearch(event.target.value)}
            />
            {search.trim() ? (
              <button
                type="button"
                className="admin-um-toolbar__search-clear"
                onClick={() => setSearch("")}
              >
                {t("search.clear")}
              </button>
            ) : null}
          </label>

          <button
            type="button"
            className={cn("admin-um-toolbar__filter", activeFilterCount > 0 && "is-active")}
            aria-label={t("filters.open")}
            onClick={() => setFilterOpen(true)}
          >
            <FilterIcon />
            {activeFilterCount > 0 ? (
              <span className="admin-um-toolbar__filter-badge">{activeFilterCount}</span>
            ) : null}
          </button>
        </div>
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

      <ProductFilterModal
        open={filterOpen}
        draft={draftFilters}
        draftFilterCount={draftFilterCount}
        activeFilterCount={activeFilterCount}
        onDraftChange={setDraftFilters}
        onClose={() => setFilterOpen(false)}
        onClearAll={() => {
          setDraftFilters(EMPTY_PRODUCT_LISTING_FILTERS);
          setFilters(EMPTY_PRODUCT_LISTING_FILTERS);
          setFilterOpen(false);
        }}
        onApply={() => {
          const sanitized = sanitizeProductListingFilters(getCatalogStore(), draftFilters);
          setDraftFilters(sanitized);
          setFilters(sanitized);
          setFilterOpen(false);
        }}
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
