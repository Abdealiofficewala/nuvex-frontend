"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import { AdminFieldError } from "@/components/admin/common/AdminFieldError";
import { AdminFieldLabel } from "@/components/admin/common/AdminFieldLabel";
import { cn } from "@/lib/utils";

export type AdminFormFieldProps = {
  id: string;
  label: ReactNode;
  required?: boolean;
  fieldError?: string;
  getErrorMessage?: (errorKey: string) => string;
  invalid?: boolean;
  errorKey?: string;
  errorMessage?: string | null;
  className?: string;
  inputClassName?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id">;

export function AdminFormField({
  id,
  label,
  required = false,
  fieldError,
  getErrorMessage,
  invalid,
  errorKey,
  errorMessage = null,
  className,
  inputClassName,
  ...inputProps
}: AdminFormFieldProps) {
  const errorId = `${id}-error`;
  const resolvedFieldError = fieldError ?? errorKey;
  const resolvedInvalid = invalid ?? Boolean(resolvedFieldError);
  const resolvedMessage = resolvedFieldError
    ? getErrorMessage?.(resolvedFieldError) ?? errorMessage
    : null;
  const showError = Boolean(resolvedMessage?.trim());

  return (
    <div className={cn("admin-contact-form__field", resolvedInvalid && "is-invalid", className)}>
      <AdminFieldLabel htmlFor={id} required={required}>
        {label}
      </AdminFieldLabel>
      <input
        id={id}
        className={inputClassName}
        aria-required={required || undefined}
        aria-invalid={resolvedInvalid || undefined}
        aria-describedby={errorId}
        {...inputProps}
      />
      <AdminFieldError id={errorId} message={resolvedMessage} />
    </div>
  );
}
