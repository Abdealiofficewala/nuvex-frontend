import { cn } from "@/lib/utils";

type AdminCheckboxProps = {
  id?: string;
  checked: boolean;
  label: string;
  disabled?: boolean;
  readOnly?: boolean;
  showLabel?: boolean;
  className?: string;
  onChange?: (checked: boolean) => void;
};

function CheckboxControl() {
  return (
    <span className="admin-checkbox__control" aria-hidden="true">
      <svg className="admin-checkbox__icon" viewBox="0 0 12 12" fill="none">
        <path
          d="M2.5 6.2 5.1 8.8 9.8 3.6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function AdminCheckbox({
  id,
  checked,
  label,
  disabled = false,
  readOnly = false,
  showLabel = false,
  className,
  onChange,
}: AdminCheckboxProps) {
  const isInteractive = Boolean(onChange) && !readOnly && !disabled;

  if (isInteractive) {
    return (
      <label
        className={cn(
          "admin-checkbox",
          showLabel && "admin-checkbox--labeled",
          checked && "is-checked",
          readOnly && "is-readonly",
          disabled && "is-disabled",
          className,
        )}
        htmlFor={id}
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          aria-label={showLabel ? undefined : label}
          onChange={(event) => onChange?.(event.target.checked)}
        />
        <CheckboxControl />
        {showLabel ? <span className="admin-checkbox__label">{label}</span> : null}
      </label>
    );
  }

  return (
    <span
      className={cn(
        "admin-checkbox",
        showLabel && "admin-checkbox--labeled",
        "is-readonly",
        checked && "is-checked",
        disabled && "is-disabled",
        className,
      )}
      aria-label={showLabel ? undefined : label}
      role={showLabel ? undefined : "img"}
    >
      <input type="checkbox" checked={checked} readOnly disabled tabIndex={-1} aria-hidden="true" />
      <CheckboxControl />
      {showLabel ? <span className="admin-checkbox__label">{label}</span> : null}
    </span>
  );
}
