"use client";

import { useTranslations } from "next-intl";
import { ThemeLivePreview } from "@/components/admin/appearance/ThemeLivePreview";
import { AdminModal } from "@/components/admin/common/AdminModal";
import { Button } from "@/components/ui/buttons";
import type { ResolvedTheme } from "@/types/appearance";

type ThemeDraftPreviewModalProps = {
  open: boolean;
  resolved: ResolvedTheme;
  onClose: () => void;
};

export function ThemeDraftPreviewModal({ open, resolved, onClose }: ThemeDraftPreviewModalProps) {
  const t = useTranslations("admin.appearance.themeForm");

  return (
    <AdminModal
      open={open}
      title={t("previewModalTitle")}
      icon="preview"
      simple
      size="xl"
      onClose={onClose}
      footer={
        <div className="appearance-modal-footer">
          <Button type="button" variant="secondary" className="admin-btn" onClick={onClose}>
            {t("previewClose")}
          </Button>
        </div>
      }
    >
      <ThemeLivePreview resolved={resolved} className="appearance-preview--in-modal" />
    </AdminModal>
  );
}
