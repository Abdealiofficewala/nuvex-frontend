"use client";

import { useId, type ReactNode } from "react";
import { AdminFieldError } from "@/components/admin/common/AdminFieldError";
import { cn } from "@/lib/utils";

export type AdminFormRadioOption = {
  label: string;
  value: string;
};

export type AdminFormRadioGroupProps = {
  id?: string;
  name?: string;
  label: ReactNode;
  required?: boolean;
  value: string;
  options: AdminFormRadioOption[];
  disabled?: boolean;
  fieldError?: string;
  getErrorMessage?: (errorKey: string) => string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  className?: string;
};

export function AdminFormRadioGroup({
  id,
  name,
  label,
  required = false,
  value,
  options,
  disabled = false,
  fieldError,
  getErrorMessage,
  onChange,
  onBlur,
  className,
}: AdminFormRadioGroupProps) {
  const generatedId = useId();
  const groupId = id ?? generatedId;
  const groupName = name ?? groupId;
  const errorId = `${groupId}-error`;
  const resolvedMessage = fieldError ? getErrorMessage?.(fieldError) ?? null : null;

  return (
    <fieldset
      className={cn(
        "admin-form-radio",
        fieldError && "is-invalid",
        disabled && "is-disabled",
        className,
      )}
      aria-describedby={resolvedMessage ? errorId : undefined}
    >
      <legend className="admin-field-label">
        {label}
        {required ? (
          <span className="admin-field-label__required" aria-hidden="true">
            *
          </span>
        ) : null}
      </legend>

      <div className="admin-form-radio__options">
        {options.map((option) => {
          const optionId = `${groupId}-${option.value}`;

          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={cn(
                "admin-form-radio__option",
                value === option.value && "is-selected",
                disabled && "is-disabled",
              )}
            >
              <input
                id={optionId}
                type="radio"
                name={groupName}
                value={option.value}
                checked={value === option.value}
                disabled={disabled}
                className="admin-form-radio__input"
                onChange={() => onChange(option.value)}
                onBlur={onBlur}
              />
              <span className="admin-form-radio__control" aria-hidden="true" />
              <span className="admin-form-radio__label">{option.label}</span>
            </label>
          );
        })}
      </div>

      <AdminFieldError id={errorId} message={resolvedMessage} />
    </fieldset>
  );
}
