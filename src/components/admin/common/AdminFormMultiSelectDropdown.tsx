"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AdminFieldLabel } from "@/components/admin/common/AdminFieldLabel";
import type { AdminFormSelectOption } from "@/components/admin/common/AdminFormSelect";
import { cn } from "@/lib/utils";

type AdminFormMultiSelectDropdownProps = {
  id: string;
  label: ReactNode;
  values: string[];
  options: AdminFormSelectOption[];
  placeholder?: string;
  emptyMessage?: string;
  selectedLabel?: (count: number) => string;
  disabled?: boolean;
  className?: string;
  onChange: (values: string[]) => void;
  onBlur?: () => void;
};

function ChevronIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5 8l5 5 5-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5 10.5 8.2 13.7 15 6.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AdminFormMultiSelectDropdown({
  id,
  label,
  values,
  options,
  placeholder = "Select…",
  emptyMessage = "No options available",
  selectedLabel,
  disabled = false,
  className,
  onChange,
  onBlur,
}: AdminFormMultiSelectDropdownProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const selectedSet = new Set(values);

  const displayLabel = (() => {
    if (values.length === 0) {
      return placeholder;
    }

    if (selectedLabel) {
      return selectedLabel(values.length);
    }

    const names = values
      .map((value) => options.find((option) => option.value === value)?.label)
      .filter(Boolean);

    if (names.length <= 2) {
      return names.join(", ");
    }

    return `${names.slice(0, 2).join(", ")} +${names.length - 2}`;
  })();

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        onBlur?.();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        onBlur?.();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onBlur]);

  function toggleOption(optionValue: string) {
    if (disabled) {
      return;
    }

    if (selectedSet.has(optionValue)) {
      onChange(values.filter((value) => value !== optionValue));
      return;
    }

    onChange([...values, optionValue]);
  }

  function toggleOpen() {
    if (disabled) {
      return;
    }

    setOpen((current) => !current);
  }

  return (
    <div
      ref={rootRef}
      className={cn(
        "admin-contact-form__field admin-form-select admin-form-multi-select-dropdown",
        open && "is-open",
        disabled && "is-disabled",
        className,
      )}
    >
      <AdminFieldLabel htmlFor={id}>{label}</AdminFieldLabel>

      <div className="admin-form-select__control">
        <button
          id={id}
          type="button"
          className="admin-form-select__trigger"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          disabled={disabled}
          onClick={toggleOpen}
        >
          <span className={cn("admin-form-select__value", values.length === 0 && "is-placeholder")}>
            {displayLabel}
          </span>
          <span className="admin-form-select__chevron">
            <ChevronIcon />
          </span>
        </button>

        {open && !disabled ? (
          <ul
            id={listId}
            className="admin-form-select__list admin-form-multi-select-dropdown__list"
            role="listbox"
            aria-labelledby={id}
            aria-multiselectable="true"
          >
            {options.length ? (
              options.map((option) => {
                const isSelected = selectedSet.has(option.value);

                return (
                  <li key={option.value} role="presentation">
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      className={cn("admin-form-select__option", isSelected && "is-selected")}
                      onClick={() => toggleOption(option.value)}
                    >
                      <span className="admin-form-select__option-label">{option.label}</span>
                      {isSelected ? (
                        <span className="admin-form-select__option-check">
                          <CheckIcon />
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })
            ) : (
              <li className="admin-form-select__empty" role="presentation">
                {emptyMessage}
              </li>
            )}
          </ul>
        ) : null}
      </div>

    </div>
  );
}
