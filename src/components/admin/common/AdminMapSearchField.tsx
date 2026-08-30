"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AdminFieldError } from "@/components/admin/common/AdminFieldError";
import { AdminFieldLabel } from "@/components/admin/common/AdminFieldLabel";
import { fetchMapSearchSuggestions, type MapSearchSuggestion } from "@/lib/utils/map-search";
import { cn } from "@/lib/utils";

type AdminMapSearchFieldProps = {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  loadingText: string;
  emptyText: string;
  fieldError?: string;
  getErrorMessage?: (errorKey: string) => string;
  invalid?: boolean;
  errorKey?: string;
  errorMessage?: string | null;
  onChange: (value: string) => void;
  onBlur?: () => void;
};

export function AdminMapSearchField({
  id,
  label,
  value,
  placeholder,
  required = false,
  disabled = false,
  loadingText,
  emptyText,
  fieldError,
  getErrorMessage,
  invalid,
  errorKey,
  errorMessage = null,
  onChange,
  onBlur,
}: AdminMapSearchFieldProps) {
  const listId = useId();
  const errorId = `${id}-error`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<MapSearchSuggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const resolvedFieldError = fieldError ?? errorKey;
  const resolvedInvalid = invalid ?? Boolean(resolvedFieldError);
  const resolvedMessage = resolvedFieldError
    ? getErrorMessage?.(resolvedFieldError) ?? errorMessage
    : null;

  useEffect(() => {
    const trimmed = value.trim();

    if (trimmed.length < 2) {
      setSuggestions([]);
      setLoading(false);
      setActiveIndex(-1);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    const timer = window.setTimeout(async () => {
      try {
        const nextSuggestions = await fetchMapSearchSuggestions(trimmed, controller.signal);
        setSuggestions(nextSuggestions);
        setActiveIndex(-1);
      } catch {
        if (!controller.signal.aborted) {
          setSuggestions([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 320);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [value]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const showDropdown = open && value.trim().length >= 2 && (loading || suggestions.length > 0);

  function selectSuggestion(suggestion: MapSearchSuggestion) {
    onChange(suggestion.query);
    setOpen(false);
    setSuggestions([]);
    setActiveIndex(-1);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown) {
      if (event.key === "ArrowDown" && value.trim().length >= 2) {
        setOpen(true);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => Math.min(current + 1, suggestions.length - 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
      return;
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      const suggestion = suggestions[activeIndex];
      if (suggestion) {
        selectSuggestion(suggestion);
      }
      return;
    }

    if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div
      ref={rootRef}
      className={cn("admin-map-search", "admin-contact-form__field", resolvedInvalid && "is-invalid")}
    >
      <AdminFieldLabel htmlFor={id} required={required}>
        {label}
      </AdminFieldLabel>
      <div className="admin-map-search__control">
        <input
          id={id}
          className="admin-map-search__input"
          type="text"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={showDropdown ? listId : undefined}
          aria-autocomplete="list"
          aria-required={required || undefined}
          aria-invalid={resolvedInvalid || undefined}
          aria-describedby={errorId}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          onChange={(event) => {
            onChange(event.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (value.trim().length >= 2) {
              setOpen(true);
            }
          }}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
        />

        {showDropdown ? (
          <ul id={listId} className="admin-map-search__list" role="listbox">
            {loading ? (
              <li className="admin-map-search__status">{loadingText}</li>
            ) : suggestions.length ? (
              suggestions.map((suggestion, index) => (
                <li key={suggestion.id} role="option" aria-selected={activeIndex === index}>
                  <button
                    type="button"
                    className={cn("admin-map-search__option", activeIndex === index && "is-active")}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectSuggestion(suggestion)}
                  >
                    {suggestion.label}
                  </button>
                </li>
              ))
            ) : (
              <li className="admin-map-search__status">{emptyText}</li>
            )}
          </ul>
        ) : null}
      </div>
      <AdminFieldError id={errorId} message={resolvedMessage} />
    </div>
  );
}
