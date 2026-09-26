"use client";

import { useTranslations } from "next-intl";
import { ThemeLivePreview } from "@/components/admin/appearance/ThemeLivePreview";
import { ButtonLink } from "@/components/ui/buttons";
import { ROUTES, themeEditHref, themePreviewHref } from "@/lib/constants";
import type { ResolvedTheme, ThemeRecord } from "@/types/appearance";

type ThemeViewDetailProps = {
  theme: ThemeRecord;
  resolved: ResolvedTheme;
};

export function ThemeViewDetail({ theme, resolved }: ThemeViewDetailProps) {
  const t = useTranslations("admin.appearance.themeView");

  return (
    <section className="appearance-view-detail">
      <dl className="appearance-view-detail__meta">
        <div>
          <dt>{t("fields.name")}</dt>
          <dd>{theme.name}</dd>
        </div>
        <div>
          <dt>{t("fields.slug")}</dt>
          <dd>{theme.slug}</dd>
        </div>
        <div>
          <dt>{t("fields.status")}</dt>
          <dd>{theme.isActive ? t("active") : t("inactive")}</dd>
        </div>
        <div>
          <dt>{t("fields.updated")}</dt>
          <dd>{new Date(theme.updatedAt).toLocaleString()}</dd>
        </div>
        <div>
          <dt>{t("fields.branding")}</dt>
          <dd>{resolved.branding.name}</dd>
        </div>
        <div>
          <dt>{t("fields.colors")}</dt>
          <dd>{resolved.colors.primary}</dd>
        </div>
      </dl>

      <ThemeLivePreview resolved={resolved} />

      <div className="appearance-theme-form__actions">
        <div className="appearance-theme-form__actions-main">
          <ButtonLink href={ROUTES.admin.theme.listing} variant="secondary" className="admin-btn">
            {t("back")}
          </ButtonLink>
          <ButtonLink href={themePreviewHref(theme.id)} variant="secondary" className="admin-btn">
            {t("preview")}
          </ButtonLink>
          <ButtonLink href={themeEditHref(theme.id)} variant="accent" className="admin-btn">
            {t("edit")}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
