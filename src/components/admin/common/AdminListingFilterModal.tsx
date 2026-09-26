"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { AdminFormSelect, type AdminFormSelectOption } from "@/components/admin/common/AdminFormSelect";
import { AdminModal } from "@/components/admin/common/AdminModal";
import { Button } from "@/components/ui/buttons";
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
      dialogClassName="is-filters"
      onClose={onClose}
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            disabled={draftActiveCount === 0}
            onClick={handleClear}
          >
            {clearLabel ?? t("clear")}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            {cancelLabel ?? t("cancel")}
          </Button>
          <Button type="button" variant="accent" onClick={handleApply}>
            {applyLabel ?? t("apply")}
          </Button>
        </>
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
