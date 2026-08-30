"use client";

import { useEffect, useId, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export type AdminModalTone = "default" | "caution";

export type AdminModalIcon = "reset" | "hide" | "info" | "preview";

type AdminModalProps = {
  open: boolean;
  title: string;
  description?: string;
  eyebrow?: string;
  tone?: AdminModalTone;
  icon?: AdminModalIcon | "none";
  simple?: boolean;
  cancelLabel?: string;
  loading?: boolean;
  onClose: () => void;
  footer?: ReactNode;
  children?: ReactNode;
  role?: "alertdialog" | "dialog";
  initialFocusRef?: RefObject<HTMLElement | null>;
};

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 7l10 10M17 7 7 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4.5 9.5A7.5 7.5 0 0 1 12 4.5c2.8 0 5.2 1.5 6.5 3.8M19.5 14.5A7.5 7.5 0 0 1 12 19.5c-2.8 0-5.2-1.5-6.5-3.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path d="M19 4v4h-4M5 20v-4h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HideIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3.5 12s2.8-5 8.5-5 8.5 5 8.5 5-2.8 5-8.5 5-8.5-5-8.5-5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4 4l16 16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 10.5v5M12 8.2h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function PreviewIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3.5 12s3.2-6 8.5-6 8.5 6 8.5 6-3.2 6-8.5 6-8.5-6-8.5-6Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

const MODAL_ICONS = {
  reset: ResetIcon,
  hide: HideIcon,
  info: InfoIcon,
  preview: PreviewIcon,
} as const;

export function AdminModal({
  open,
  title,
  description,
  eyebrow,
  tone = "default",
  icon = "info",
  simple = false,
  cancelLabel,
  loading = false,
  onClose,
  footer,
  children,
  role = "dialog",
  initialFocusRef,
}: AdminModalProps) {
  const t = useTranslations("admin.common.modal");
  const titleId = useId();
  const descriptionId = useId();
  const showDescription = Boolean(description) && !simple;
  const Icon = icon !== "none" ? MODAL_ICONS[icon] : null;
  const resolvedFooter =
    footer ??
    (cancelLabel ? (
      <button
        type="button"
        className="admin-modal__btn admin-modal__btn--cancel ui-button ui-button--secondary"
        disabled={loading}
        onClick={onClose}
      >
        {cancelLabel}
      </button>
    ) : null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = window.requestAnimationFrame(() => {
      initialFocusRef?.current?.focus();
    });

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !loading) {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [initialFocusRef, loading, onClose, open]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="admin-modal" role="presentation">
      <button
        type="button"
        className="admin-modal__backdrop"
        aria-label={t("close")}
        disabled={loading}
        onClick={onClose}
      />

      <div
        className={cn(
          "admin-modal__dialog",
          tone === "caution" && "is-caution",
          simple && "is-simple",
        )}
        role={role}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={showDescription ? descriptionId : undefined}
      >
        <button
          type="button"
          className="admin-modal__close"
          aria-label={t("close")}
          disabled={loading}
          onClick={onClose}
        >
          <CloseIcon />
        </button>

        <div className="admin-modal__body">
          {simple ? (
            <div className={cn("admin-modal__copy", "admin-modal__copy--full")}>
              <div className="admin-modal__headline">
                {Icon ? (
                  <div className={cn("admin-modal__icon", "admin-modal__icon--inline", tone === "caution" && "is-caution")}>
                    <Icon />
                  </div>
                ) : null}
                <h2 id={titleId} className="admin-modal__title">
                  {title}
                </h2>
              </div>
              {children}
            </div>
          ) : (
            <>
              {Icon ? (
                <div className={cn("admin-modal__icon", tone === "caution" && "is-caution")}>
                  <Icon />
                </div>
              ) : null}

              <div className={cn("admin-modal__copy", !Icon && "admin-modal__copy--full")}>
                <p className="admin-modal__eyebrow">{eyebrow ?? t("eyebrow")}</p>
                <h2 id={titleId} className="admin-modal__title">
                  {title}
                </h2>
                {description ? (
                  <p id={descriptionId} className="admin-modal__desc">
                    {description}
                  </p>
                ) : null}
                {children}
              </div>
            </>
          )}
        </div>

        {resolvedFooter ? <div className="admin-modal__footer">{resolvedFooter}</div> : null}
      </div>
    </div>,
    document.body,
  );
}
