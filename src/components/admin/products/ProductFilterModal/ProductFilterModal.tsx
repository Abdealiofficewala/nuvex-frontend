"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  AdminFormSelect,
  AdminListingFilterModalFooter,
  AdminModal,
} from "@/components/admin/common";
import { getCatalogStore } from "@/lib/products/store";
import { getProductFilterOptions, type ProductListingFilters } from "@/lib/products/product-listing-filters";

type ProductFilterModalProps = {
  open: boolean;
  draft: ProductListingFilters;
  draftFilterCount: number;
  activeFilterCount: number;
  onDraftChange: (next: ProductListingFilters) => void;
  onClose: () => void;
  onApply: () => void;
  onClearAll: () => void;
};

export function ProductFilterModal({
  open,
  draft,
  draftFilterCount,
  activeFilterCount,
  onDraftChange,
  onClose,
  onApply,
  onClearAll,
}: ProductFilterModalProps) {
  const t = useTranslations("admin.products.catalog.listing");
  const tFilters = useTranslations("admin.common.filters");

  const options = useMemo(() => getProductFilterOptions(getCatalogStore(), draft), [draft]);

  function patch(patch: Partial<ProductListingFilters>) {
    onDraftChange({ ...draft, ...patch });
  }

  return (
    <AdminModal
      open={open}
      title={t("filters.modalTitle")}
      icon="filter"
      simple
      dialogClassName="is-filters"
      size="wide"
      onClose={onClose}
      footer={
        <AdminListingFilterModalFooter
          resetLabel={t("filters.clearAll")}
          cancelLabel={tFilters("cancel")}
          applyLabel={t("filters.apply")}
          resetDisabled={draftFilterCount === 0 && activeFilterCount === 0}
          onReset={onClearAll}
          onCancel={onClose}
          onApply={onApply}
        />
      }
    >
      <div className="admin-listing-filter-modal__grid">
        <AdminFormSelect
          id="product-filter-category"
          label={t("filters.category")}
          value={draft.categoryId}
          placeholder={t("filters.all")}
          options={options.categories}
          onChange={(value) => patch({ categoryId: value })}
        />
        <AdminFormSelect
          id="product-filter-type"
          label={t("filters.type")}
          value={draft.typeId}
          placeholder={t("filters.all")}
          options={options.types}
          onChange={(value) =>
            patch({
              typeId: value,
              sizeId: "",
              materialId: "",
              gradeId: "",
              standardId: "",
              finishId: "",
              threadId: "",
            })
          }
        />
        <AdminFormSelect
          id="product-filter-status"
          label={t("filters.status")}
          value={draft.status}
          placeholder={t("filters.all")}
          options={[
            { value: "active", label: t("status.active") },
            { value: "draft", label: t("status.draft") },
            { value: "archived", label: t("status.archived") },
          ]}
          onChange={(value) => patch({ status: value })}
        />
        <AdminFormSelect
          id="product-filter-size"
          label={t("filters.size")}
          value={draft.sizeId}
          placeholder={t("filters.all")}
          options={options.sizes}
          onChange={(value) => patch({ sizeId: value })}
        />
        <AdminFormSelect
          id="product-filter-material"
          label={t("filters.material")}
          value={draft.materialId}
          placeholder={t("filters.all")}
          options={options.materials}
          onChange={(value) => patch({ materialId: value, gradeId: "" })}
        />
        <AdminFormSelect
          id="product-filter-grade"
          label={t("filters.grade")}
          value={draft.gradeId}
          placeholder={t("filters.all")}
          options={options.grades}
          onChange={(value) => patch({ gradeId: value })}
        />
        <AdminFormSelect
          id="product-filter-standard"
          label={t("filters.standard")}
          value={draft.standardId}
          placeholder={t("filters.all")}
          options={options.standards}
          onChange={(value) => patch({ standardId: value })}
        />
        <AdminFormSelect
          id="product-filter-finish"
          label={t("filters.finish")}
          value={draft.finishId}
          placeholder={t("filters.all")}
          options={options.finishes}
          onChange={(value) => patch({ finishId: value })}
        />
        <AdminFormSelect
          id="product-filter-thread"
          label={t("filters.thread")}
          value={draft.threadId}
          placeholder={t("filters.all")}
          options={options.threads}
          onChange={(value) => patch({ threadId: value })}
        />
        <AdminFormSelect
          id="product-filter-industry"
          label={t("filters.industry")}
          value={draft.industryId}
          placeholder={t("filters.all")}
          options={options.industries}
          onChange={(value) => patch({ industryId: value })}
        />
        <AdminFormSelect
          id="product-filter-application"
          label={t("filters.application")}
          value={draft.applicationId}
          placeholder={t("filters.all")}
          options={options.applications}
          onChange={(value) => patch({ applicationId: value })}
        />
        <AdminFormSelect
          id="product-filter-packaging"
          label={t("filters.packaging")}
          value={draft.packagingId}
          placeholder={t("filters.all")}
          options={options.packaging}
          onChange={(value) => patch({ packagingId: value })}
        />
      </div>
    </AdminModal>
  );
}
