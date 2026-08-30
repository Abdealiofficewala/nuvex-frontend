"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AdminFieldError } from "@/components/admin/common/AdminFieldError";
import { AdminFieldLabel } from "@/components/admin/common/AdminFieldLabel";
import { cn, hasValue } from "@/lib/utils";

export type AdminFormSelectOption = {
  label: string;
  value: string;
};

export type AdminFormSelectProps = {
  id: string;
  label: ReactNode;
  required?: boolean;
  fieldError?: string;
  getErrorMessage?: (errorKey: string) => string;
  className?: string;
  placeholder?: string;
  value: string;
  options: AdminFormSelectOption[];
  disabled?: boolean;
  onChange: (value: string) => void;
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

export function AdminFormSelect({
  id,
  label,
  required = false,
  fieldError,
  getErrorMessage,
  className,
  placeholder,
  value,
  options,
  disabled = false,
  onChange,
  onBlur,
}: AdminFormSelectProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const errorId = `${id}-error`;
  const resolvedMessage = fieldError ? getErrorMessage?.(fieldError) ?? null : null;
  const showError = Boolean(resolvedMessage?.trim());
  const selectedOption = options.find((option) => option.value === value);
  const displayLabel = selectedOption?.label ?? placeholder ?? "Select an option";

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

  function selectOption(nextValue: string) {
    onChange(nextValue);
    setOpen(false);
    onBlur?.();
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
        "admin-contact-form__field admin-form-select",
        open && "is-open",
        fieldError && "is-invalid",
        disabled && "is-disabled",
        className,
      )}
    >
      <AdminFieldLabel htmlFor={id} required={required}>
        {label}
      </AdminFieldLabel>

      <div className="admin-form-select__control">
        <button
          id={id}
          type="button"
          className="admin-form-select__trigger"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-required={required || undefined}
          aria-invalid={Boolean(fieldError) || undefined}
          aria-describedby={errorId}
          disabled={disabled}
          onClick={toggleOpen}
          onBlur={(event) => {
            if (!rootRef.current?.contains(event.relatedTarget as Node)) {
              onBlur?.();
            }
          }}
        >
          <span className={cn("admin-form-select__value", !hasValue(value) && "is-placeholder")}>
            {displayLabel}
          </span>
          <span className="admin-form-select__chevron">
            <ChevronIcon />
          </span>
        </button>

        {open && !disabled ? (
          <ul id={listId} className="admin-form-select__list" role="listbox" aria-labelledby={id}>
            {options.length ? (
              options.map((option) => {
                const isSelected = option.value === value;

                return (
                  <li key={option.value} role="presentation">
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      className={cn("admin-form-select__option", isSelected && "is-selected")}
                      onClick={() => selectOption(option.value)}
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
                {placeholder ?? "No options available"}
              </li>
            )}
          </ul>
        ) : null}
      </div>

      <AdminFieldError id={errorId} message={resolvedMessage} />
    </div>
  );
}
