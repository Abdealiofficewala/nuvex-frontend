"use client";

import { FilterSelect } from "@/components/ui/filter";
import { isFilterChip } from "@/lib/i18n-messages";
import { cn } from "@/lib/utils";
import type { CatalogFilterState } from "@/lib/product-filters";
import type { ProductCategory } from "@/types/product";
import type { FilterOption, SelectOption } from "@/types/ui";

type ProductFilterProps = {
  filters: CatalogFilterState;
  categories: ProductCategory[];
  categoryCounts: Record<string, number>;
  subcategories: FilterOption[];
  allLabel: string;
  title: string;
  lineLabel: string;
  typeLabel: string;
  typeAllLabel: string;
  featuredLabel: string;
  clearLabel: string;
  closeLabel: string;
  appliedLabel: string;
  resultsLabel?: string;
  open?: boolean;
  onClose?: () => void;
  onChange: (next: Partial<CatalogFilterState>) => void;
  onClear: () => void;
};

export function ProductFilter({
  filters,
  categories,
  categoryCounts,
  subcategories,
  allLabel,
  title,
  lineLabel,
  typeLabel,
  typeAllLabel,
  featuredLabel,
  clearLabel,
  closeLabel,
  appliedLabel,
  resultsLabel,
  open = false,
  onClose,
  onChange,
  onClear,
}: ProductFilterProps) {
  const lineOptions: SelectOption[] = [
    { value: "all", label: allLabel, count: categoryCounts.all ?? 0 },
    ...(categories ?? []).map((item) => ({
      value: item.slug,
      label: item.name,
      count: categoryCounts[item.slug] ?? 0,
    })),
  ];
  const typeOptions: SelectOption[] = [
    { value: "", label: typeAllLabel },
    ...subcategories.map((item) => ({
      value: item.slug,
      label: item.name,
      count: item.count,
    })),
  ];
  const selectedLine = lineOptions.find((item) => item.value === filters.category);
  const selectedType = typeOptions.find((item) => item.value === filters.subcategory);
  const chips = [
    filters.category !== "all" && selectedLine
      ? { key: "category", label: selectedLine.label, clear: () => onChange({ category: "all", subcategory: "" }) }
      : null,
    filters.subcategory && selectedType
      ? { key: "subcategory", label: selectedType.label, clear: () => onChange({ subcategory: "" }) }
      : null,
    filters.featured ? { key: "featured", label: featuredLabel, clear: () => onChange({ featured: false }) } : null,
  ].filter(isFilterChip);

  return (
    <aside
      className={cn("catalog-filters", open && "is-open")}
      aria-label={title}
    >
      <div className={"catalog-filters__head"}>
        <div className={"catalog-filters__head-copy"}>
          <h2 className={"catalog-filters__title"}>{title}</h2>
          {chips.length ? (
            <span className={"catalog-filters__badge"} aria-hidden="true">
              {chips.length}
            </span>
          ) : null}
        </div>
        <div className={"catalog-filters__head-actions"}>
          {chips.length ? (
            <button type="button" className={"catalog-filters__text-btn"} onClick={onClear}>
              {clearLabel}
            </button>
          ) : null}
          {onClose ? (
            <button type="button" className={"catalog-filters__close"} onClick={onClose} aria-label={closeLabel}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M7.5 7.5 16.5 16.5M16.5 7.5 7.5 16.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          ) : null}
        </div>
      </div>

      <div className={"catalog-filters__body"}>
        {chips.length ? (
          <div className={"filter-chips"}>
            <p className={"filter-select__label"}>{appliedLabel}</p>
            <div className={"filter-chips__row"}>
              {chips.map((chip) => (
                <button key={chip.key} type="button" className={"filter-chip"} onClick={chip.clear}>
                  {chip.label}
                  <span aria-hidden="true">×</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <FilterSelect
          label={lineLabel}
          value={filters.category}
          options={lineOptions}
          onChange={(value) => onChange({ category: value, subcategory: "" })}
        />
        <FilterSelect
          label={typeLabel}
          value={filters.subcategory}
          options={typeOptions}
          disabled={typeOptions.length <= 1}
          onChange={(value) => onChange({ subcategory: value })}
        />

        <label
          className={cn(
            "filter-switch",
            filters.featured && "is-on",
          )}
        >
          <span>{featuredLabel}</span>
          <input
            type="checkbox"
            checked={filters.featured}
            onChange={(event) => onChange({ featured: event.target.checked })}
          />
        </label>
      </div>

      {onClose ? (
        <div className={"catalog-filters__foot"}>
          <button type="button" className={"catalog-filters__apply"} onClick={onClose}>
            {resultsLabel ?? closeLabel}
          </button>
        </div>
      ) : null}
    </aside>
  );
}
