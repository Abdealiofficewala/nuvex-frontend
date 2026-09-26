"use client";

import Image from "next/image";
import { useId } from "react";
import { AdminFieldError } from "@/components/admin/common/AdminFieldError";
import { AdminFieldLabel } from "@/components/admin/common/AdminFieldLabel";
import { AdminFormField } from "@/components/admin/common/AdminFormField";
import { AdminFormImageUpload } from "@/components/admin/common";
import { Button } from "@/components/ui/buttons";
import { createEmptySizeOption } from "@/lib/product-size-options";
import { cn } from "@/lib/utils";
import type { ProductSizeOption } from "@/types/product";

type ProductSizeOptionsEditorProps = {
  value: ProductSizeOption[];
  onChange: (value: ProductSizeOption[]) => void;
  onBlur?: () => void;
  disabled?: boolean;
  fieldError?: string;
  getErrorMessage?: (errorKey: string) => string;
  labels: {
    title: string;
    add: string;
    remove: string;
    default: string;
    sizeLabel: string;
    sizePlaceholder: string;
    imageLabel: string;
  };
};

export function ProductSizeOptionsEditor({
  value,
  onChange,
  onBlur,
  disabled = false,
  fieldError,
  getErrorMessage,
  labels,
}: ProductSizeOptionsEditorProps) {
  const groupId = useId();

  function updateRow(index: number, patch: Partial<ProductSizeOption>) {
    onChange(
      value.map((item, rowIndex) => (rowIndex === index ? { ...item, ...patch } : item)),
    );
    onBlur?.();
  }

  function setDefault(index: number) {
    onChange(value.map((item, rowIndex) => ({ ...item, isDefault: rowIndex === index })));
    onBlur?.();
  }

  function removeRow(index: number) {
    const next = value.filter((_, rowIndex) => rowIndex !== index);
    if (next.length && !next.some((item) => item.isDefault)) {
      next[0] = { ...next[0], isDefault: true };
    }
    onChange(next);
    onBlur?.();
  }

  function addRow() {
    onChange([...value, createEmptySizeOption(value.length === 0)]);
    onBlur?.();
  }

  return (
    <div className="admin-form-grid__full admin-product-size-options">
      <AdminFieldLabel htmlFor={groupId} required>
        {labels.title}
      </AdminFieldLabel>

      <div className="admin-product-size-options__list">
        {value.map((row, index) => (
          <div key={`${groupId}-${index}`} className="admin-product-size-options__row">
            <div className="admin-product-size-options__row-head">
              <label className="admin-product-size-options__default">
                <input
                  type="radio"
                  name={`${groupId}-default`}
                  checked={row.isDefault === true || (index === 0 && !value.some((item) => item.isDefault))}
                  onChange={() => setDefault(index)}
                  disabled={disabled}
                />
                <span>{labels.default}</span>
              </label>
              <Button
                type="button"
                variant="secondary"
                className="admin-product-size-options__remove"
                disabled={disabled}
                onClick={() => removeRow(index)}
              >
                {labels.remove}
              </Button>
            </div>

            <div className="admin-product-size-options__fields">
              <AdminFormField
                id={`${groupId}-label-${index}`}
                label={labels.sizeLabel}
                required
                value={row.label}
                onChange={(event) => updateRow(index, { label: event.target.value })}
                placeholder={labels.sizePlaceholder}
                disabled={disabled}
              />

              <AdminFormImageUpload
                id={`${groupId}-image-${index}`}
                label={labels.imageLabel}
                required
                variant="logo"
                value={row.image}
                onChange={(nextImage) => updateRow(index, { image: nextImage, gallery: nextImage ? [nextImage] : [] })}
                onBlur={onBlur}
                disabled={disabled}
              />
            </div>

            {row.image ? (
              <div className={cn("admin-product-size-options__preview", "appearance-branding-thumb")}>
                <Image
                  src={row.image}
                  alt=""
                  width={56}
                  height={56}
                  unoptimized
                  className="appearance-branding-thumb__image"
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="secondary"
        className="admin-product-size-options__add"
        disabled={disabled}
        onClick={addRow}
      >
        {labels.add}
      </Button>

      {fieldError && getErrorMessage ? (
        <AdminFieldError message={getErrorMessage(fieldError)} />
      ) : null}
    </div>
  );
}
