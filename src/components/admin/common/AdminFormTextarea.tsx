"use client";

import type { ReactNode } from "react";
import { AdminFieldError } from "@/components/admin/common/AdminFieldError";
import { AdminFieldLabel } from "@/components/admin/common/AdminFieldLabel";
import { cn } from "@/lib/utils";

export type AdminFormTextareaProps = {
  id: string;
  label: ReactNode;
  required?: boolean;
  fieldError?: string;
  getErrorMessage?: (errorKey: string) => string;
  className?: string;
  rows?: number;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
};

export function AdminFormTextarea({
  id,
  label,
  required = false,
  fieldError,
  getErrorMessage,
  className,
  rows = 4,
  value,
  onChange,
  onBlur,
  placeholder,
  disabled = false,
}: AdminFormTextareaProps) {
  const errorId = `${id}-error`;
  const resolvedMessage = fieldError ? getErrorMessage?.(fieldError) ?? null : null;
  const showError = Boolean(resolvedMessage?.trim());

  return (
    <div className={cn("admin-contact-form__field", fieldError && "is-invalid", className)}>
      <AdminFieldLabel htmlFor={id} required={required}>
        {label}
      </AdminFieldLabel>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        aria-required={required || undefined}
        aria-invalid={Boolean(fieldError) || undefined}
        aria-describedby={errorId}
      />
      <AdminFieldError id={errorId} message={resolvedMessage} />
    </div>
  );
}
