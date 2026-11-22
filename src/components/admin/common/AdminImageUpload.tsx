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

export type AdminImageUploadVariant = "default" | "logo" | "icon" | "banner" | "profile";

export type AdminImageUploadSize = "default" | "compact";

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
  variant?: AdminImageUploadVariant;
  size?: AdminImageUploadSize;
  /** Shown in the empty `profile` preview when no image is set. */
  placeholderInitials?: string;
  className?: string;
};

const DEFAULT_LABELS: Required<Pick<AdminImageUploadLabels, "drop" | "browse" | "change" | "remove">> =
  {
    drop: "Drag and drop an image here",
    browse: "Browse files",
    change: "Change",
    remove: "Remove",
  };

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M8 14l2.5-2.5a1.2 1.2 0 0 1 1.7 0L15 14M12 11V17"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 8.5h.01M15 8.5h.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function ProfilePlaceholderIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8.5" r="3.25" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5.5 19.5c.9-3.1 3.2-5 6.5-5s5.6 1.9 6.5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
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
  variant = "default",
  size = "default",
  placeholderInitials,
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
  const hasImage = hasValue(value);
  const objectFit =
    variant === "default" || variant === "banner" || variant === "profile" ? "cover" : "contain";
  const emptyInitials = placeholderInitials?.trim().slice(0, 2).toUpperCase();

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

  function handleRemove(event: React.MouseEvent) {
    event.stopPropagation();
    setUploadError(null);
    onChange("");
  }

  const fileInput = (
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
  );

  if (size === "compact") {
    return (
      <div
        className={cn(
          "admin-contact-form__field admin-image-upload admin-image-upload--compact",
          `admin-image-upload--${variant}`,
          (fieldError || uploadError) && "is-invalid",
          className,
        )}
      >
        <AdminFieldLabel htmlFor={fieldId} required={required}>
          {label}
        </AdminFieldLabel>

        <div
          className={cn(
            "admin-image-upload__compact",
            isDragging && "is-dragging",
            hasImage && "has-image",
            disabled && "is-disabled",
          )}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <button
            type="button"
            className="admin-image-upload__compact-thumb"
            onClick={openPicker}
            disabled={disabled}
            aria-label={hasImage ? resolvedLabels.change : resolvedLabels.browse}
          >
            {hasImage ? (
              value.startsWith("data:") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={value}
                  alt=""
                  className={cn(
                    "admin-image-upload__compact-image admin-image-upload__compact-image--native",
                    objectFit === "contain" && "is-contain",
                  )}
                  style={{ objectFit }}
                />
              ) : (
                <Image
                  src={value}
                  alt=""
                  fill
                  sizes="72px"
                  className={cn("admin-image-upload__compact-image", objectFit === "contain" && "is-contain")}
                  style={{ objectFit }}
                />
              )
            ) : (
              <span
                className={cn(
                  "admin-image-upload__compact-placeholder",
                  variant === "profile" && "admin-image-upload__compact-placeholder--profile",
                )}
              >
                {variant === "profile" && emptyInitials ? (
                  <span className="admin-image-upload__compact-initials">{emptyInitials}</span>
                ) : variant === "profile" ? (
                  <ProfilePlaceholderIcon />
                ) : (
                  <UploadIcon />
                )}
              </span>
            )}
          </button>

          <div className="admin-image-upload__compact-body">
            {!hasImage ? (
              <>
                <p className="admin-image-upload__compact-title">{resolvedLabels.drop}</p>
                <p className="admin-image-upload__compact-hint">{hintText}</p>
                <button
                  type="button"
                  className="admin-image-upload__compact-action"
                  onClick={openPicker}
                  disabled={disabled}
                >
                  {resolvedLabels.browse}
                </button>
              </>
            ) : (
              <>
                <p className="admin-image-upload__compact-hint">{hintText}</p>
                <div className="admin-image-upload__compact-actions">
                  <button
                    type="button"
                    className="admin-image-upload__compact-action"
                    onClick={openPicker}
                    disabled={disabled}
                  >
                    {resolvedLabels.change}
                  </button>
                  <button
                    type="button"
                    className="admin-image-upload__compact-action admin-image-upload__compact-action--danger"
                    onClick={handleRemove}
                    disabled={disabled}
                  >
                    {resolvedLabels.remove}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {fileInput}
        <AdminFieldError id={errorId} message={resolvedMessage} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "admin-contact-form__field admin-image-upload",
        `admin-image-upload--${variant}`,
        (fieldError || uploadError) && "is-invalid",
        className,
      )}
    >
      <AdminFieldLabel htmlFor={fieldId} required={required}>
        {label}
      </AdminFieldLabel>

      <div
        className={cn(
          "admin-image-upload__surface",
          isDragging && "is-dragging",
          hasImage && "has-image",
          disabled && "is-disabled",
        )}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!hasImage && !disabled ? openPicker : undefined}
        onKeyDown={(event) => {
          if (!hasImage && !disabled && (event.key === "Enter" || event.key === " ")) {
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
                <img
                  src={value}
                  alt=""
                  className={cn(
                    "admin-image-upload__image admin-image-upload__image--native",
                    objectFit === "contain" && "is-contain",
                  )}
                  style={{ objectFit }}
                />
              ) : (
                <Image
                  src={value}
                  alt=""
                  fill
                  sizes={variant === "icon" ? "120px" : variant === "banner" ? "360px" : "320px"}
                  className={cn("admin-image-upload__image", objectFit === "contain" && "is-contain")}
                  style={{ objectFit }}
                />
              )}
            </div>
            <div className="admin-image-upload__footer">
              <button
                type="button"
                className="admin-image-upload__footer-btn"
                onClick={(event) => {
                  event.stopPropagation();
                  openPicker();
                }}
                disabled={disabled}
              >
                {resolvedLabels.change}
              </button>
              <span className="admin-image-upload__footer-divider" aria-hidden="true" />
              <button
                type="button"
                className="admin-image-upload__footer-btn admin-image-upload__footer-btn--danger"
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
            <div className="admin-image-upload__copy">
              <p className="admin-image-upload__drop-label">{resolvedLabels.drop}</p>
              <p className="admin-image-upload__hint">{hintText}</p>
            </div>
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

      {fileInput}

      <AdminFieldError id={errorId} message={resolvedMessage} />
    </div>
  );
}
