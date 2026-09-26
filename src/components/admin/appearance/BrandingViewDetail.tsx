"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/buttons";
import { ROUTES, brandingEditHref } from "@/lib/constants";
import type { BrandingRecord } from "@/types/appearance";

const BRAND_IMAGE_FIELDS = ["logo", "logoLight", "logoDark", "mobileLogo", "favicon"] as const;

type BrandingViewDetailProps = {
  branding: BrandingRecord;
};

function BrandingAssetPreview({
  label,
  src,
  emptyLabel,
}: {
  label: string;
  src?: string;
  emptyLabel: string;
}) {
  return (
    <article className="appearance-branding-view-card">
      <h3 className="appearance-branding-view-card__label">{label}</h3>
      <div className="appearance-branding-view-card__frame">
        {src ? (
          <Image
            src={src}
            alt=""
            width={160}
            height={64}
            unoptimized
            className="appearance-branding-view-card__image"
          />
        ) : (
          <span className="appearance-branding-view-card__empty">{emptyLabel}</span>
        )}
      </div>
    </article>
  );
}

export function BrandingViewDetail({ branding }: BrandingViewDetailProps) {
  const t = useTranslations("admin.appearance.brandingView");

  return (
    <section className="appearance-view-detail appearance-branding-view">
      <dl className="appearance-view-detail__meta appearance-branding-view__meta">
        <div>
          <dt>{t("fields.name")}</dt>
          <dd>{branding.name}</dd>
        </div>
        <div>
          <dt>{t("fields.slug")}</dt>
          <dd>{branding.slug}</dd>
        </div>
      </dl>

      <section className="appearance-branding-view__assets" aria-labelledby="branding-view-assets-heading">
        <h2 id="branding-view-assets-heading" className="appearance-branding-view__assets-heading">
          {t("sections.assets")}
        </h2>
        <div className="appearance-branding-view__grid">
          {BRAND_IMAGE_FIELDS.map((key) => (
            <BrandingAssetPreview
              key={key}
              label={t(`fields.${key}`)}
              src={branding[key]}
              emptyLabel={t("noImage")}
            />
          ))}
        </div>
      </section>

      <div className="appearance-theme-form__actions appearance-branding-view__actions">
        <div className="appearance-theme-form__actions-main">
          <ButtonLink href={ROUTES.admin.theme.logos} variant="secondary" className="admin-btn">
            {t("back")}
          </ButtonLink>
          <ButtonLink href={brandingEditHref(branding.id)} variant="accent" className="admin-btn">
            {t("edit")}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
