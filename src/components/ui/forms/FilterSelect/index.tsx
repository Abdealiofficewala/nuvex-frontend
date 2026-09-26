"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { SelectOption } from "@/types/ui";

type FilterSelectProps = {
  label: string;
  value: string;
  options: SelectOption[];
  disabled?: boolean;
  onChange: (value: string) => void;
};

export function FilterSelect({
  label,
  value,
  options,
  disabled,
  onChange,
}: FilterSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className={open ? "filter-select is-open" : "filter-select"} ref={rootRef}>
      <p className="filter-select__label">{label}</p>
      <button
        type="button"
        className="filter-select__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        disabled={disabled || !options.length}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{selected?.label}</span>
        {typeof selected?.count === "number" ? <em>{selected.count}</em> : null}
      </button>
      {open && !disabled ? (
        <ul className="filter-select__list" id={listId} role="listbox">
          {options.map((option) => (
            <li key={option.value} role="none">
              <button
                type="button"
                role="option"
                aria-selected={option.value === value}
                className={option.value === value ? "is-active" : undefined}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                <span>{option.label}</span>
                {typeof option.count === "number" ? <em>{option.count}</em> : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
