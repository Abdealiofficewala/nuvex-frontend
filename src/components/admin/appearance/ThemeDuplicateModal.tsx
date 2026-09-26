"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AdminFormField } from "@/components/admin/common/AdminFormField";
import { AdminModal } from "@/components/admin/common/AdminModal";
import { Button } from "@/components/ui/buttons";
import { normalizeSlug } from "@/lib/appearance/slug";
import { cn } from "@/lib/utils";
import type { ThemeRecord } from "@/types/appearance";

type ThemeDuplicateModalProps = {
  open: boolean;
  source: ThemeRecord | null;
  loading?: boolean;
  onConfirm: (values: { name: string; slug: string }) => void;
  onClose: () => void;
};

export function ThemeDuplicateModal({
  open,
  source,
  loading = false,
  onConfirm,
  onClose,
}: ThemeDuplicateModalProps) {
  const t = useTranslations("admin.appearance.themes.duplicate");
  const formId = useId();
  const confirmRef = useRef<HTMLButtonElement>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    if (!open || !source) {
      return;
    }

    setName(t("defaultName", { name: source.name }));
    setSlug(normalizeSlug(`${source.slug}-copy`));
  }, [open, source, t]);

  const submitDisabled = loading || !name.trim() || !slug.trim();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitDisabled) {
      return;
    }

    onConfirm({ name: name.trim(), slug: normalizeSlug(slug || name) });
  }

  return (
    <AdminModal
      open={open}
      title={t("modal.title")}
      icon="reset"
      simple
      loading={loading}
      role="dialog"
      onClose={onClose}
      footer={
        <div className="appearance-modal-footer">
          <Button
            type="button"
            variant="secondary"
            className="admin-modal__btn admin-modal__btn--cancel"
            disabled={loading}
            onClick={onClose}
          >
            {t("modal.cancel")}
          </Button>
          <Button
            ref={confirmRef}
            type="submit"
            form={formId}
            variant="accent"
            className={cn("admin-modal__btn", "admin-modal__btn--confirm")}
            disabled={submitDisabled}
          >
            {loading ? t("modal.saving") : t("modal.confirm")}
          </Button>
        </div>
      }
    >
      <form id={formId} className="appearance-duplicate-modal" onSubmit={handleSubmit}>
        {source ? (
          <p className="admin-modal__desc appearance-duplicate-modal__desc">
            {t("modal.description", { name: source.name })}
          </p>
        ) : null}
        <div className="admin-form-grid appearance-duplicate-modal__fields">
          <AdminFormField
            id="duplicate-theme-name"
            label={t("modal.nameLabel")}
            required
            value={name}
            disabled={loading}
            autoFocus={open}
            onChange={(event) => setName(event.target.value)}
          />
          <AdminFormField
            id="duplicate-theme-slug"
            label={t("modal.slugLabel")}
            required
            value={slug}
            disabled={loading}
            onChange={(event) => setSlug(event.target.value)}
          />
        </div>
      </form>
    </AdminModal>
  );
}
