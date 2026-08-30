"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProductFilter } from "@/components/website/products/ProductFilter";
import { ProductGrid } from "@/components/website/products/ProductGrid";
import {
  applyCatalogFilters,
  categoryCounts,
  countActiveFilters,
  EMPTY_CATALOG_FILTERS,
  filtersToQueryString,
  subcategoryOptions,
  type CatalogFilterState,
} from "@/lib/product-filters";
import type { Product, ProductCategory } from "@/types/product";

type ProductCatalogProps = {
  products?: Product[];
  categories?: ProductCategory[];
  initialFilters?: CatalogFilterState;
};

export function ProductCatalog({
  products,
  categories,
  initialFilters = EMPTY_CATALOG_FILTERS,
}: ProductCatalogProps) {
  const t = useTranslations("products");
  const [filters, setFilters] = useState<CatalogFilterState>(initialFilters);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const timer = useRef<number>(0);
  const catalog = products ?? [];
  const lines = categories ?? [];

  const counts = useMemo(() => categoryCounts(catalog, lines), [catalog, lines]);
  const types = useMemo(
    () => subcategoryOptions(catalog, filters.category),
    [catalog, filters.category],
  );
  const visible = useMemo(() => applyCatalogFilters(catalog, filters), [catalog, filters]);
  const activeCount = countActiveFilters(filters);

  function syncUrl(next: CatalogFilterState) {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const qs = filtersToQueryString(next);
      const href = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
      window.history.replaceState(window.history.state, "", href);
    }, 160);
  }

  function update(partial: Partial<CatalogFilterState>) {
    setFilters((current) => {
      const next = { ...current, ...partial };
      if (partial.category && partial.category !== current.category) {
        next.subcategory = partial.subcategory ?? "";
      }
      syncUrl(next);
      return next;
    });
  }

  function clear() {
    setFilters(EMPTY_CATALOG_FILTERS);
    syncUrl(EMPTY_CATALOG_FILTERS);
  }

  useEffect(() => {
    if (!drawerOpen) {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      return;
    }

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <div className={cn("product-catalog", drawerOpen && "is-filtering")}>
      {drawerOpen ? (
        <button
          type="button"
          className={"catalog-filters__backdrop"}
          aria-label={t("filters.close")}
          onClick={() => setDrawerOpen(false)}
        />
      ) : null}

      <ProductFilter
        filters={filters}
        categories={lines}
        categoryCounts={counts}
        subcategories={types}
        allLabel={t("all")}
        title={t("filters.title")}
        lineLabel={t("filters.line")}
        typeLabel={t("filters.type")}
        typeAllLabel={t("filters.typeAll")}
        featuredLabel={t("filters.featured")}
        clearLabel={t("filters.clear")}
        closeLabel={t("filters.close")}
        appliedLabel={t("filters.applied")}
        resultsLabel={t("filters.viewResults", { count: visible.length })}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onChange={update}
        onClear={clear}
      />

      <div className={"catalog-results"}>
        <div className={"catalog-toolbar"}>
          <label className={"catalog-search"}>
            <span className="sr-only">{t("search")}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm9 1.5-3.8-3.8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="search"
              value={filters.q}
              onChange={(event) => update({ q: event.target.value })}
              placeholder={t("search")}
            />
          </label>
          <button
            type="button"
            className={cn(
              "catalog-toolbar__filters",
              activeCount > 0 && "is-active",
            )}
            onClick={() => setDrawerOpen(true)}
            aria-expanded={drawerOpen}
            aria-label={
              activeCount
                ? `${t("filters.title")} (${activeCount})`
                : t("filters.title")
            }
          >
            <span className={"catalog-toolbar__filters-icon"} aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path
                  d="M4 7h16M7 12h10M10 17h4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              {activeCount ? <em>{activeCount}</em> : null}
            </span>
            <span className={"catalog-toolbar__filters-label"}>{t("filters.title")}</span>
          </button>
          <p className={"catalog-toolbar__meta"}>
            {t("showing", { count: visible.length, total: catalog.length })}
          </p>
        </div>

        <ProductGrid
          products={visible}
          empty={
            <div className={"product-empty"}>
              <p className="t-caption">{t("emptyEyebrow")}</p>
              <h2 className="t-h3">{t("emptyTitle")}</h2>
              <p className="t-muted">{t("emptyLede")}</p>
              {activeCount ? (
                <Button type="button" variant="secondary" className="mt-5" onClick={clear}>
                  {t("filters.clear")}
                </Button>
              ) : null}
            </div>
          }
        />
      </div>
    </div>
  );
}
