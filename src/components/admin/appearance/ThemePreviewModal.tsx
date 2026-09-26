"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ThemeLivePreview } from "@/components/admin/appearance/ThemeLivePreview";
import { AdminConfirmModal } from "@/components/admin/common/AdminConfirmModal";
import { AdminModal } from "@/components/admin/common/AdminModal";
import { Button } from "@/components/ui/buttons";
import { useToast } from "@/components/ui/toast";
import { appearanceService } from "@/services/appearance.service";
import type { ResolvedTheme } from "@/types/appearance";

type ThemePreviewModalProps = {
  themeId: string | null;
  onClose: () => void;
  onEdit?: (themeId: string) => void;
};

export function ThemePreviewModal({ themeId, onClose, onEdit }: ThemePreviewModalProps) {
  const t = useTranslations("admin.appearance.previewPage");
  const toast = useToast();
  const [resolved, setResolved] = useState<ResolvedTheme | null>(null);
  const [loading, setLoading] = useState(false);
  const [activateOpen, setActivateOpen] = useState(false);
  const [activating, setActivating] = useState(false);

  useEffect(() => {
    if (!themeId) {
      return;
    }

    let mounted = true;
    const frame = window.requestAnimationFrame(() => {
      setLoading(true);
      void appearanceService.getTheme(themeId).then((result) => {
        if (!mounted) return;
        setResolved(result.resolved);
        setLoading(false);
      });
    });

    return () => {
      mounted = false;
      window.cancelAnimationFrame(frame);
    };
  }, [themeId]);

  const displayResolved = themeId ? resolved : null;

  async function handleActivate() {
    if (!themeId) return;
    setActivating(true);
    try {
      await appearanceService.activateTheme(themeId);
      toast.success(t("activate.success.title"), t("activate.success.body"));
      setActivateOpen(false);
      onClose();
    } catch {
      toast.error(t("activate.errors.title"), t("activate.errors.generic"));
    } finally {
      setActivating(false);
    }
  }

  return (
    <>
      <AdminModal
        open={Boolean(themeId)}
        title={displayResolved?.theme.name ?? t("loading")}
        description={displayResolved?.theme.description || undefined}
        icon="preview"
        simple
        size="xl"
        onClose={onClose}
        footer={
          <div className="appearance-modal-footer">
            <Button type="button" variant="secondary" onClick={onClose}>
              {t("back")}
            </Button>
            {displayResolved && onEdit ? (
              <Button type="button" variant="secondary" className="admin-btn" onClick={() => onEdit(displayResolved.theme.id)}>
                {t("edit")}
              </Button>
            ) : null}
            {displayResolved && !displayResolved.theme.isActive ? (
              <Button type="button" variant="accent" className="admin-btn" onClick={() => setActivateOpen(true)}>
                {t("activateAction")}
              </Button>
            ) : displayResolved?.theme.isActive ? (
              <span className="appearance-status is-active">{t("active")}</span>
            ) : null}
          </div>
        }
      >
        {loading && themeId ? <p className="appearance-modal-loading">{t("loading")}</p> : null}
        {displayResolved ? (
          <ThemeLivePreview resolved={displayResolved} className="appearance-preview--in-modal" />
        ) : null}
      </AdminModal>

      <AdminConfirmModal
        open={activateOpen}
        tone="default"
        icon="hide"
        title={t("activate.confirm.title")}
        description={t("activate.confirm.description", { name: displayResolved?.theme.name ?? "" })}
        confirmLabel={t("activate.confirm.confirm")}
        loading={activating}
        onConfirm={handleActivate}
        onCancel={() => {
          if (!activating) setActivateOpen(false);
        }}
      />
    </>
  );
}
