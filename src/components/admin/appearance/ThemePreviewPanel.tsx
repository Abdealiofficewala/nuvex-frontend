"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ThemeLivePreview } from "@/components/admin/appearance/ThemeLivePreview";
import { useActiveTheme } from "@/components/admin/appearance/ActiveThemeProvider";
import { AdminConfirmModal } from "@/components/admin/common/AdminConfirmModal";
import { Button, ButtonLink } from "@/components/ui/buttons";
import { useToast } from "@/components/ui/toast";
import { ROUTES, themeEditHref } from "@/lib/constants";
import { appearanceService } from "@/services/appearance.service";
import type { ResolvedTheme } from "@/types/appearance";

type ThemePreviewPanelProps = {
  themeId: string;
};

export function ThemePreviewPanel({ themeId }: ThemePreviewPanelProps) {
  const t = useTranslations("admin.appearance.previewPage");
  const toast = useToast();
  const { setPreviewResolved } = useActiveTheme();
  const [resolved, setResolved] = useState<ResolvedTheme | null>(null);
  const [activateOpen, setActivateOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const frame = window.requestAnimationFrame(() => {
      void appearanceService.getTheme(themeId).then((result) => {
        if (!mounted) return;
        setResolved(result.resolved);
        setPreviewResolved(result.resolved);
      });
    });

    return () => {
      mounted = false;
      window.cancelAnimationFrame(frame);
      setPreviewResolved(null);
    };
  }, [themeId, setPreviewResolved]);

  async function handleActivate() {
    setLoading(true);
    try {
      await appearanceService.activateTheme(themeId);
      toast.success(t("activate.success.title"), t("activate.success.body"));
      setActivateOpen(false);
    } catch {
      toast.error(t("activate.errors.title"), t("activate.errors.generic"));
    } finally {
      setLoading(false);
    }
  }

  if (!resolved) {
    return <p>{t("loading")}</p>;
  }

  return (
    <section className="appearance-preview-page">
      <div className="admin-page-toolbar">
        <p className="admin-page-toolbar__meta">
          {resolved.theme.isActive ? t("active") : t("activateAction")}
        </p>
        <div className="appearance-preview-page__actions">
          <ButtonLink href={themeEditHref(themeId)} variant="secondary">
            {t("edit")}
          </ButtonLink>
          {!resolved.theme.isActive ? (
            <Button type="button" variant="accent" onClick={() => setActivateOpen(true)}>
              {t("activateAction")}
            </Button>
          ) : (
            <span className="appearance-status is-active">{t("active")}</span>
          )}
          <ButtonLink href={ROUTES.admin.theme.listing} variant="secondary">
            {t("back")}
          </ButtonLink>
        </div>
      </div>

      <ThemeLivePreview resolved={resolved} />

      <AdminConfirmModal
        open={activateOpen}
        tone="default"
        icon="hide"
        title={t("activate.confirm.title")}
        description={t("activate.confirm.description", { name: resolved.theme.name })}
        confirmLabel={t("activate.confirm.confirm")}
        loading={loading}
        onConfirm={handleActivate}
        onCancel={() => {
          if (!loading) setActivateOpen(false);
        }}
      />
    </section>
  );
}
