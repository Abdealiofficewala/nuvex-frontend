"use client";

import { useId, useRef } from "react";
import { ColorTokenPreview } from "@/components/admin/appearance/ColorTokenPreview";
import type { ColorPalettePreviewContext, ColorPaletteTokenKey } from "@/lib/appearance/color-palette-groups";
import { cn } from "@/lib/utils";

type AdminColorFieldProps = {
  id: string;
  label: string;
  token: ColorPaletteTokenKey;
  examples?: string;
  previewContext: ColorPalettePreviewContext;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

export function AdminColorField({
  id,
  label,
  token,
  examples,
  previewContext,
  value,
  disabled = false,
  onChange,
}: AdminColorFieldProps) {
  const pickerId = useId();
  const pickerRef = useRef<HTMLInputElement>(null);

  return (
    <div className={cn("appearance-color-card", disabled && "is-disabled")}>
      <div className="appearance-color-card__preview" aria-hidden="true">
        <ColorTokenPreview token={token} color={value} context={previewContext} />
      </div>

      <div className="appearance-color-card__main">
        <button
          type="button"
          className="appearance-color-card__swatch"
          style={{ background: value }}
          aria-label={label}
          disabled={disabled}
          onClick={() => pickerRef.current?.click()}
        />
        <div className="appearance-color-card__body">
          <label htmlFor={id} className="appearance-color-card__label">
            {label}
          </label>
          {examples ? <p className="appearance-color-card__examples">{examples}</p> : null}
          <input
            id={id}
            type="text"
            className="appearance-color-card__input"
            value={value}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value)}
          />
        </div>
      </div>

      <input
        ref={pickerRef}
        id={pickerId}
        type="color"
        className="appearance-color-card__picker"
        value={value}
        disabled={disabled}
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
