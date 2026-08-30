"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { AdminModal, type AdminModalIcon, type AdminModalTone } from "@/components/admin/common/AdminModal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AdminConfirmModalProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: AdminModalTone;
  icon?: AdminModalIcon;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function AdminConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  tone = "default",
  icon,
  loading = false,
  onConfirm,
  onCancel,
}: AdminConfirmModalProps) {
  const t = useTranslations("admin.common.modal");
  const confirmRef = useRef<HTMLButtonElement>(null);
  const modalIcon = icon ?? (tone === "caution" ? "hide" : "reset");

  return (
    <AdminModal
      open={open}
      title={title}
      description={description}
      tone={tone}
      icon={modalIcon}
      loading={loading}
      role="alertdialog"
      initialFocusRef={confirmRef}
      onClose={onCancel}
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            className="admin-modal__btn admin-modal__btn--cancel"
            disabled={loading}
            onClick={onCancel}
          >
            {cancelLabel ?? t("cancel")}
          </Button>
          <Button
            ref={confirmRef}
            type="button"
            variant={tone === "default" ? "accent" : "primary"}
            className={cn("admin-modal__btn", "admin-modal__btn--confirm")}
            disabled={loading}
            onClick={onConfirm}
          >
            {loading ? t("working") : (confirmLabel ?? t("confirm"))}
          </Button>
        </>
      }
    />
  );
}
