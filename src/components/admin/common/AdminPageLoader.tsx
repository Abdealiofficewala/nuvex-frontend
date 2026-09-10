"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { LOADER_MEDIA } from "@/lib/loader.config";

type AdminPageLoaderProps = {
  fullScreen?: boolean;
};

function LoaderDots() {
  return (
    <div className="admin-loader__dots" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

export function AdminPageLoader({ fullScreen = false }: AdminPageLoaderProps) {
  const t = useTranslations("admin.loading");

  if (fullScreen) {
    return (
      <div className="admin-loader admin-loader--fullscreen" aria-busy="true" aria-live="polite">
        <div className="admin-loader__stage">
          <div className="admin-loader__visual">
            <Image
              src={LOADER_MEDIA.adminBanner}
              alt=""
              fill
              sizes="480px"
              className="admin-loader__visual-image"
              priority
            />
            <span className="admin-loader__visual-overlay" aria-hidden="true" />
            <div className="admin-loader__visual-brand">
              <Image
                src={LOADER_MEDIA.adminLogoLight}
                alt=""
                width={36}
                height={48}
                className="admin-loader__visual-logo"
                priority
              />
            </div>
          </div>

          <div className="admin-loader__body">
            <div className="admin-loader__copy">
              <p className="admin-loader__eyebrow">{t("eyebrow")}</p>
              <p className="admin-loader__label">{t("label")}</p>
              <p className="admin-loader__hint">{t("hint")}</p>
            </div>
            <LoaderDots />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-loader admin-loader--page" aria-busy="true" aria-live="polite">
      <div className="admin-panel admin-loader__panel admin-loader__panel--simple">
        <div className="admin-loader__beam" aria-hidden="true" />

        <div className="admin-loader__center">
          <div className="admin-loader__hero-mark" aria-hidden="true">
            <span className="admin-loader__hero-ring" />
            <span className="admin-loader__hero-icon">
              <Image src={LOADER_MEDIA.adminMark} alt="" width={28} height={28} priority />
            </span>
          </div>

          <div className="admin-loader__copy admin-loader__copy--center">
            <p className="admin-loader__eyebrow">{t("eyebrow")}</p>
            <p className="admin-loader__label">{t("label")}</p>
            <p className="admin-loader__hint">{t("hint")}</p>
          </div>

          <LoaderDots />

          <div className="admin-loader__progress" aria-hidden="true">
            <span className="admin-loader__progress-bar" />
          </div>
        </div>
      </div>
    </div>
  );
}
