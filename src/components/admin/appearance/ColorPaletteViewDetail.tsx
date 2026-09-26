"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { ColorTokenPreview } from "@/components/admin/appearance/ColorTokenPreview";
import { ButtonLink } from "@/components/ui/buttons";
import {
  COLOR_PALETTE_GROUPS,
  isColorPaletteTokenKey,
  type ColorPaletteTokenKey,
} from "@/lib/appearance/color-palette-groups";
import { ROUTES, colorPaletteEditHref } from "@/lib/constants";
import type { ColorPaletteRecord } from "@/types/appearance";

type ColorPaletteViewDetailProps = {
  palette: ColorPaletteRecord;
};

function formatColorLabel(key: string) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
}

export function ColorPaletteViewDetail({ palette }: ColorPaletteViewDetailProps) {
  const t = useTranslations("admin.appearance.colorView");
  const tForm = useTranslations("admin.appearance.colorForm");

  const previewContext = useMemo(
    () => ({
      background: palette.colors.background,
      surface: palette.colors.surface,
      text: palette.colors.text,
      muted: palette.colors.muted,
      border: palette.colors.border,
    }),
    [palette.colors],
  );

  const extraColors = Object.entries(palette.colors).filter(([key]) => !isColorPaletteTokenKey(key));

  return (
    <section className="appearance-view-detail">
      <dl className="appearance-view-detail__meta">
        <div>
          <dt>{t("fields.name")}</dt>
          <dd>{palette.name}</dd>
        </div>
        <div>
          <dt>{t("fields.slug")}</dt>
          <dd>{palette.slug}</dd>
        </div>
      </dl>

      <div className="appearance-color-sections">
        {COLOR_PALETTE_GROUPS.map((group) => (
          <section key={group.id} className="appearance-color-section">
            <header className="appearance-color-section__head">
              <h3 className="appearance-color-section__title">{tForm(`sections.${group.id}.title`)}</h3>
              <p className="appearance-color-section__description">{tForm(`sections.${group.id}.description`)}</p>
            </header>

            <div className="appearance-color-grid appearance-color-grid--readonly">
              {group.keys.map((key) => (
                <div key={key} className="appearance-color-card appearance-color-card--readonly">
                  <div className="appearance-color-card__preview" aria-hidden="true">
                    <ColorTokenPreview
                      token={key as ColorPaletteTokenKey}
                      color={palette.colors[key]}
                      context={previewContext}
                    />
                  </div>
                  <div className="appearance-color-card__main">
                    <span
                      className="appearance-color-card__swatch"
                      style={{ background: palette.colors[key] }}
                      aria-hidden="true"
                    />
                    <div className="appearance-color-card__body">
                      <span className="appearance-color-card__label">{tForm(`colors.${key}`)}</span>
                      <p className="appearance-color-card__examples">{tForm(`colorsExamples.${key}`)}</p>
                      <code className="appearance-color-card__value">{palette.colors[key]}</code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {extraColors.length ? (
          <section className="appearance-color-section">
            <header className="appearance-color-section__head">
              <h3 className="appearance-color-section__title">{t("extraTokensTitle")}</h3>
              <p className="appearance-color-section__description">{t("extraTokensDescription")}</p>
            </header>

            <div className="appearance-color-grid appearance-color-grid--readonly">
              {extraColors.map(([key, value]) => (
                <div key={key} className="appearance-color-card appearance-color-card--readonly">
                  <div className="appearance-color-card__main">
                    <span className="appearance-color-card__swatch" style={{ background: value }} aria-hidden="true" />
                    <div className="appearance-color-card__body">
                      <span className="appearance-color-card__label">{formatColorLabel(key)}</span>
                      <code className="appearance-color-card__value">{value}</code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <div className="appearance-theme-form__actions">
        <div className="appearance-theme-form__actions-main">
          <ButtonLink href={ROUTES.admin.theme.colors} variant="secondary" className="admin-btn">
            {t("back")}
          </ButtonLink>
          <ButtonLink href={colorPaletteEditHref(palette.id)} variant="accent" className="admin-btn">
            {t("edit")}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
