"use client";

import { AdminFieldError } from "@/components/admin/common/AdminFieldError";
import { AdminFieldLabel } from "@/components/admin/common/AdminFieldLabel";
import { findPhoneCountryByDial, PHONE_COUNTRY_OPTIONS } from "@/lib/phone-countries.config";
import { sanitizePhoneNumberInput } from "@/lib/utils/phone";
import { cn } from "@/lib/utils";

type AdminPhoneFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  countryCode: string;
  number: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  onCountryChange: (countryCode: string) => void;
  onNumberChange: (number: string) => void;
  onBlur?: () => void;
};

export function AdminPhoneField({
  id,
  label,
  required = false,
  countryCode,
  number,
  placeholder,
  disabled = false,
  error,
  onCountryChange,
  onNumberChange,
  onBlur,
}: AdminPhoneFieldProps) {
  const selectedCountry = findPhoneCountryByDial(countryCode);
  const errorId = `${id}-error`;

  return (
    <div className={cn("admin-phone-field", error && "is-invalid")}>
      <AdminFieldLabel htmlFor={`${id}-number`} required={required}>
        {label}
      </AdminFieldLabel>
      <div className="admin-phone-field__control">
        <label className="sr-only" htmlFor={`${id}-country`}>
          {label} country code
        </label>
        <select
          id={`${id}-country`}
          className="admin-phone-field__dial"
          value={countryCode}
          disabled={disabled}
          aria-label={selectedCountry ? `${selectedCountry.label} ${countryCode}` : "Country code"}
          onChange={(event) => onCountryChange(event.target.value)}
        >
          {PHONE_COUNTRY_OPTIONS.map((option) => (
            <option key={`${option.code}-${option.dial}`} value={option.dial}>
              {option.dial} · {option.label}
            </option>
          ))}
        </select>
        <span className="admin-phone-field__divider" aria-hidden="true" />
        <input
          id={`${id}-number`}
          className="admin-phone-field__number"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={number}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(event) => onNumberChange(sanitizePhoneNumberInput(event.target.value))}
          onBlur={onBlur}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={errorId}
        />
      </div>
      <AdminFieldError id={errorId} message={error} />
    </div>
  );
}
