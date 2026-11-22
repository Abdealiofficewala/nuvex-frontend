"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { AdminFormSelect, type AdminFormSelectOption } from "@/components/admin/common/AdminFormSelect";
import { AdminListingFilterModalFooter } from "@/components/admin/common/AdminListingFilterModalFooter";
import { AdminModal } from "@/components/admin/common/AdminModal";
import {
  buildDefaultListingFilterValues,
  countActiveListingFilters,
} from "@/lib/admin/listing-filters";

export type AdminListingFilterField = {
  id: string;
  label: string;
  value: string;
  options: AdminFormSelectOption[];
  placeholder?: string;
  defaultValue?: string;
};

type AdminListingFilterModalProps = {
  open: boolean;
  title: string;
  description?: string;
  fields: AdminListingFilterField[];
  onApply: (values: Record<string, string>) => void;
  onClose: () => void;
  clearLabel?: string;
  cancelLabel?: string;
  applyLabel?: string;
};

export function AdminListingFilterModal({
  open,
  title,
  description,
  fields,
  onApply,
  onClose,
  clearLabel,
  cancelLabel,
  applyLabel,
}: AdminListingFilterModalProps) {
  const t = useTranslations("admin.common.filters");
  const [draftValues, setDraftValues] = useState<Record<string, string>>({});

  const defaultValues = useMemo(() => buildDefaultListingFilterValues(fields), [fields]);

  useEffect(() => {
    if (open) {
      setDraftValues(Object.fromEntries(fields.map((field) => [field.id, field.value])));
    }
  }, [fields, open]);

  const draftActiveCount = countActiveListingFilters(fields, draftValues);

  function updateDraftValue(id: string, value: string) {
    setDraftValues((current) => ({ ...current, [id]: value }));
  }

  function handleClear() {
    setDraftValues(defaultValues);
    onApply(defaultValues);
  }

  function handleApply() {
    onApply(draftValues);
  }

  return (
    <AdminModal
      open={open}
      title={title}
      description={description}
      icon="filter"
      simple
      dialogClassName="is-filters"
      onClose={onClose}
      footer={
        <AdminListingFilterModalFooter
          resetLabel={clearLabel ?? t("clear")}
          cancelLabel={cancelLabel ?? t("cancel")}
          applyLabel={applyLabel ?? t("apply")}
          resetDisabled={draftActiveCount === 0}
          onReset={handleClear}
          onCancel={onClose}
          onApply={handleApply}
        />
      }
    >
      <div className="admin-listing-filter-modal__fields">
        {fields.map((field) => (
          <AdminFormSelect
            key={field.id}
            id={`listing-filter-${field.id}`}
            label={field.label}
            value={draftValues[field.id] ?? field.defaultValue ?? ""}
            options={field.options}
            placeholder={field.placeholder}
            onChange={(value) => updateDraftValue(field.id, value)}
          />
        ))}
      </div>
    </AdminModal>
  );
}
