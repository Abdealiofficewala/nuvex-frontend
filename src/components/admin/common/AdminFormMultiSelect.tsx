"use client";

import { AdminCheckbox } from "@/components/admin/common/AdminCheckbox";
import { AdminFieldLabel } from "@/components/admin/common/AdminFieldLabel";
import { cn } from "@/lib/utils";

export type AdminFormMultiSelectOption = {
  value: string;
  label: string;
};

type AdminFormMultiSelectProps = {
  id: string;
  label: string;
  values: string[];
  options: AdminFormMultiSelectOption[];
  disabled?: boolean;
  emptyMessage?: string;
  className?: string;
  onChange: (values: string[]) => void;
};

export function AdminFormMultiSelect({
  id,
  label,
  values,
  options,
  disabled = false,
  emptyMessage,
  className,
  onChange,
}: AdminFormMultiSelectProps) {
  const selectedSet = new Set(values);

  function toggle(value: string, checked: boolean) {
    if (disabled) {
      return;
    }

    if (checked) {
      if (selectedSet.has(value)) {
        return;
      }
      onChange([...values, value]);
      return;
    }

    onChange(values.filter((entry) => entry !== value));
  }

  return (
    <div className={cn("admin-form-multi-select", className)}>
      <AdminFieldLabel htmlFor={id} required={false}>
        {label}
      </AdminFieldLabel>
      {options.length === 0 ? (
        <p className="admin-form-multi-select__empty">{emptyMessage ?? "—"}</p>
      ) : (
        <div
          id={id}
          className="admin-form-multi-select__list"
          role="group"
          aria-labelledby={`${id}-label`}
        >
          {options.map((option) => (
            <AdminCheckbox
              key={option.value}
              id={`${id}-${option.value}`}
              label={option.label}
              showLabel
              disabled={disabled}
              checked={selectedSet.has(option.value)}
              onChange={(checked) => toggle(option.value, checked)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
