"use client";

import { useId, type ReactNode } from "react";
import { AdminFieldError } from "@/components/admin/common/AdminFieldError";
import { cn } from "@/lib/utils";

export type AdminFormSwitchProps = {
  id?: string;
  label: ReactNode;
  description?: ReactNode;
  checked: boolean;
  disabled?: boolean;
  onLabel?: string;
  offLabel?: string;
  fieldError?: string;
  getErrorMessage?: (errorKey: string) => string;
  onChange: (checked: boolean) => void;
  onBlur?: () => void;
  className?: string;
};

export function AdminFormSwitch({
  id,
  label,
  description,
  checked,
  disabled = false,
  onLabel = "Yes",
  offLabel = "No",
  fieldError,
  getErrorMessage,
  onChange,
  onBlur,
  className,
}: AdminFormSwitchProps) {
  const generatedId = useId();
  const switchId = id ?? generatedId;
  const errorId = `${switchId}-error`;
  const resolvedMessage = fieldError ? getErrorMessage?.(fieldError) ?? null : null;
  const stateLabel = checked ? onLabel : offLabel;

  return (
    <div
      className={cn(
        "admin-form-switch",
        fieldError && "is-invalid",
        disabled && "is-disabled",
        className,
      )}
    >
      <div className="admin-form-switch__head">
        <span className="admin-field-label">{label}</span>
        {description ? <p className="admin-form-switch__description">{description}</p> : null}
      </div>

      <button
        id={switchId}
        type="button"
        className={cn("admin-form-switch__control", checked && "is-on")}
        role="switch"
        aria-checked={checked}
        aria-describedby={resolvedMessage ? errorId : undefined}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        onBlur={onBlur}
      >
        <span className="admin-form-switch__track" aria-hidden="true">
          <span className="admin-form-switch__thumb" />
        </span>
        <span className="admin-form-switch__state">{stateLabel}</span>
      </button>

      <AdminFieldError id={errorId} message={resolvedMessage} />
    </div>
  );
}
