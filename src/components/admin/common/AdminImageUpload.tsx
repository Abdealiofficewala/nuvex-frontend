"use client";

import Image from "next/image";
import { useId, useRef, useState, type ChangeEvent, type DragEvent, type ReactNode } from "react";
import { AdminFieldError } from "@/components/admin/common/AdminFieldError";
import { AdminFieldLabel } from "@/components/admin/common/AdminFieldLabel";
import {
  resolveImageUploadConstraints,
  type ImageUploadConstraints,
} from "@/lib/image-upload.config";
import { cn, hasValue } from "@/lib/utils";
import {
  formatImageUploadHint,
  readFileAsDataUrl,
  validateImageFile,
  type ImageUploadValidationError,
} from "@/lib/utils/image-upload";

export type AdminImageUploadLabels = {
  drop?: string;
  browse?: string;
  change?: string;
  remove?: string;
  hint?: string;
  /** @deprecated Use `hint` instead */
  types?: string;
};

export type AdminImageUploadProps = {
  id?: string;
  label: ReactNode;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  fieldError?: string;
  getErrorMessage?: (errorKey: string) => string;
  constraints?: Partial<ImageUploadConstraints>;
  labels?: AdminImageUploadLabels;
  uploadErrorMessages?: Partial<Record<ImageUploadValidationError, string>>;
  className?: string;
};

const DEFAULT_LABELS: Required<Pick<AdminImageUploadLabels, "drop" | "browse" | "change" | "remove">> =
  {
    drop: "Drag and drop an image here",
    browse: "Browse files",
    change: "Change image",
    remove: "Remove",
  };

function UploadHint({ text }: { text: string }) {
  return (
    <p className="admin-image-upload__hint">
      <span>{text}</span>
    </p>
  );
}
function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 16V6m0 0 4 4m-4-4-4 4M5 20h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AdminImageUpload({
  id,
  label,
  required = false,
  value,
  onChange,
  onBlur,
  disabled = false,
  fieldError,
  getErrorMessage,
  constraints,
  labels,
  uploadErrorMessages,
  className,
}: AdminImageUploadProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const resolvedConstraints = resolveImageUploadConstraints(constraints);
  const resolvedLabels = { ...DEFAULT_LABELS, ...labels };
  const hintText = formatImageUploadHint(resolvedConstraints, {
    hint: labels?.hint ?? labels?.types,
  });

  const errorId = `${fieldId}-error`;
  const resolvedFieldMessage = fieldError ? getErrorMessage?.(fieldError) ?? null : null;
  const resolvedMessage = uploadError ?? resolvedFieldMessage;
  const showError = Boolean(resolvedMessage?.trim());
  const hasImage = hasValue(value);

  function openPicker() {
    if (!disabled) {
      inputRef.current?.click();
    }
  }

  async function processFile(file: File | undefined) {
    if (!file || disabled) {
      return;
    }

    const validationError = validateImageFile(file, resolvedConstraints);
    if (validationError) {
      setUploadError(uploadErrorMessages?.[validationError] ?? validationError);
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setUploadError(null);
      onChange(dataUrl);
    } catch {
      setUploadError(uploadErrorMessages?.invalidType ?? "Could not read this file.");
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    void processFile(file);
  }

  function handleDragEnter(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (!disabled) {
      setIsDragging(true);
    }
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    if (disabled) {
      return;
    }

    const file = event.dataTransfer.files?.[0];
    void processFile(file);
  }

  function handleRemove() {
    setUploadError(null);
    onChange("");
  }

  return (
    <div
      className={cn(
        "admin-contact-form__field admin-image-upload",
        (fieldError || uploadError) && "is-invalid",
        className,
      )}
    >
      <AdminFieldLabel htmlFor={fieldId} required={required}>
        {label}
      </AdminFieldLabel>

      <div
        className={cn(
          "admin-image-upload__dropzone",
          isDragging && "is-dragging",
          hasImage && "has-image",
          disabled && "is-disabled",
        )}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!hasImage ? openPicker : undefined}
        onKeyDown={(event) => {
          if (!hasImage && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            openPicker();
          }
        }}
        role={hasImage ? undefined : "button"}
        tabIndex={hasImage || disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
      >
        {hasImage ? (
          <>
            <div className="admin-image-upload__preview">
              {value.startsWith("data:") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={value} alt="" className="admin-image-upload__image admin-image-upload__image--native" />
              ) : (
                <Image src={value} alt="" fill sizes="280px" className="admin-image-upload__image" />
              )}
            </div>
            <div className="admin-image-upload__overlay">
              <button
                type="button"
                className="admin-image-upload__btn"
                onClick={openPicker}
                disabled={disabled}
              >
                {resolvedLabels.change}
              </button>
              <button
                type="button"
                className="admin-image-upload__btn admin-image-upload__btn--ghost"
                onClick={handleRemove}
                disabled={disabled}
              >
                {resolvedLabels.remove}
              </button>
            </div>
          </>
        ) : (
          <div className="admin-image-upload__empty">
            <span className="admin-image-upload__icon">
              <UploadIcon />
            </span>
            <p className="admin-image-upload__drop-label">{resolvedLabels.drop}</p>
            <UploadHint text={hintText} />
            <button
              type="button"
              className="admin-image-upload__browse"
              onClick={(event) => {
                event.stopPropagation();
                openPicker();
              }}
              disabled={disabled}
            >
              {resolvedLabels.browse}
            </button>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        id={fieldId}
        type="file"
        accept={resolvedConstraints.accept}
        className="admin-image-upload__input"
        disabled={disabled}
        onChange={handleFileChange}
        onBlur={onBlur}
        aria-invalid={Boolean(fieldError || uploadError) || undefined}
        aria-describedby={errorId}
      />

      <AdminFieldError id={errorId} message={resolvedMessage} />
    </div>
  );
}
