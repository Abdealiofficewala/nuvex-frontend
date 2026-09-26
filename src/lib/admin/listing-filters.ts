import type { AdminFormSelectOption } from "@/components/admin/common/AdminFormSelect";

export type ListingFilterState = {
  id: string;
  value: string;
  defaultValue?: string;
};

export type ListingFilterSummaryField = ListingFilterState & {
  label: string;
  options: AdminFormSelectOption[];
};

export type ListingFilterSummary = {
  id: string;
  label: string;
  valueLabel: string;
};

export function countActiveListingFilters(
  fields: readonly ListingFilterState[],
  values?: Record<string, string>,
) {
  return fields.filter((field) => {
    const defaultValue = field.defaultValue ?? "";
    const currentValue = values?.[field.id] ?? field.value;

    return currentValue !== defaultValue;
  }).length;
}

export function buildListingFilterValues(fields: readonly ListingFilterState[]) {
  return Object.fromEntries(fields.map((field) => [field.id, field.value]));
}

export function buildDefaultListingFilterValues(
  fields: readonly Pick<ListingFilterState, "id" | "defaultValue">[],
) {
  return Object.fromEntries(fields.map((field) => [field.id, field.defaultValue ?? ""]));
}

export function getListingFilterSummaries(
  fields: readonly ListingFilterSummaryField[],
  values: Record<string, string>,
): ListingFilterSummary[] {
  return fields.flatMap((field) => {
    const defaultValue = field.defaultValue ?? "";
    const currentValue = values[field.id] ?? field.value;

    if (currentValue === defaultValue) {
      return [];
    }

    const option = field.options.find((item) => item.value === currentValue);

    return [
      {
        id: field.id,
        label: field.label,
        valueLabel: option?.label ?? currentValue,
      },
    ];
  });
}
