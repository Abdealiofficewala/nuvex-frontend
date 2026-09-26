"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { resolvedThemeToCssVars } from "@/lib/appearance/css-vars";
import { cn } from "@/lib/utils";
import type { ResolvedTheme } from "@/types/appearance";

type PreviewViewport = "desktop" | "tablet" | "mobile";

type ThemeLivePreviewProps = {
  resolved: ResolvedTheme;
  className?: string;
};

function DesktopIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 20h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function TabletIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="18" r="0.75" fill="currentColor" />
    </svg>
  );
}

function MobileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="7" y="2" width="10" height="20" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="18.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

const VIEWPORT_ICONS = {
  desktop: DesktopIcon,
  tablet: TabletIcon,
  mobile: MobileIcon,
} as const;

export function ThemeLivePreview({ resolved, className }: ThemeLivePreviewProps) {
  const t = useTranslations("admin.appearance.preview");
  const [viewport, setViewport] = useState<PreviewViewport>("desktop");

  const style = useMemo(() => resolvedThemeToCssVars(resolved), [resolved]);
  const { branding, colors, typography } = resolved;

  const navItems = [
    t("site.nav.home"),
    t("site.nav.products"),
    t("site.nav.industries"),
    t("site.nav.about"),
  ];

  const products = [t("site.product1"), t("site.product2"), t("site.product3")];

  return (
    <div className={cn("appearance-preview", className)}>
      <div className="appearance-preview__toolbar">
        <div className="appearance-preview__palette">
          {(["primary", "accent", "background", "surface", "text"] as const).map((key) => (
            <span key={key} className="appearance-preview__palette-chip" title={key}>
              <i style={{ background: colors[key] }} />
              <small>{key}</small>
            </span>
          ))}
        </div>
        <div className="appearance-preview__viewports" role="tablist" aria-label={t("viewportLabel")}>
          {(["desktop", "tablet", "mobile"] as const).map((item) => {
            const Icon = VIEWPORT_ICONS[item];
            return (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={viewport === item}
                aria-label={t(`viewports.${item}`)}
                data-viewport={item}
                className={cn("appearance-preview__viewport", viewport === item && "is-active")}
                onClick={() => setViewport(item)}
              >
                <Icon />
                <span>{t(`viewports.${item}`)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={cn(
          "appearance-preview__frame",
          viewport === "tablet" && "is-tablet",
          viewport === "mobile" && "is-mobile",
        )}
      >
        <div className="appearance-preview__chrome">
          <span />
          <span />
          <span />
        </div>

        <div className="appearance-site-preview" style={style}>
          <header className="appearance-site-preview__navbar">
            <div className="appearance-site-preview__navbar-inner">
              <div className="appearance-site-preview__brand">
                {branding.logo ? (
                  <Image
                    src={branding.logo}
                    alt={branding.brandName}
                    width={120}
                    height={32}
                    style={{ width: "auto", height: "100%", maxHeight: 28 }}
                    unoptimized
                  />
                ) : (
                  <strong>{branding.brandName}</strong>
                )}
              </div>

              <nav className="appearance-site-preview__nav" aria-hidden={viewport === "mobile"}>
                {navItems.map((label, index) => (
                  <span
                    key={label}
                    className={cn("appearance-site-preview__nav-link", index === 1 && "is-active")}
                  >
                    {label}
                  </span>
                ))}
              </nav>

              <div className="appearance-site-preview__navbar-actions">
                <span className="appearance-site-preview__quote">{t("site.quote")}</span>
                <span className="appearance-site-preview__menu-toggle" aria-hidden={viewport !== "mobile"}>
                  <i />
                  <i />
                  <i />
                </span>
              </div>
            </div>
          </header>

          <section className="appearance-site-preview__hero">
            <div className="appearance-site-preview__hero-media" />
            <div className="appearance-site-preview__hero-content">
              <p className="appearance-site-preview__eyebrow">{t("site.eyebrow")}</p>
              <h1
                className="appearance-site-preview__hero-title"
                style={{ fontFamily: typography.headingFont }}
              >
                {t("site.heroTitle")}
              </h1>
              <p
                className="appearance-site-preview__hero-body"
                style={{ fontFamily: typography.bodyFont }}
              >
                {t("site.heroBody")}
              </p>
              <div className="appearance-site-preview__hero-actions">
                <span className="appearance-site-preview__btn appearance-site-preview__btn--primary">
                  {t("site.ctaPrimary")}
                </span>
                <span className="appearance-site-preview__btn appearance-site-preview__btn--ghost">
                  {t("site.ctaSecondary")}
                </span>
              </div>
            </div>
          </section>

          <section className="appearance-site-preview__products">
            <div className="appearance-site-preview__section-head">
              <h2 style={{ fontFamily: typography.headingFont }}>{t("site.productsTitle")}</h2>
            </div>
            <div className="appearance-site-preview__product-grid">
              {products.map((name, index) => (
                <article key={name} className="appearance-site-preview__product-card">
                  <div className="appearance-site-preview__product-media">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="appearance-site-preview__product-body">
                    <h3 style={{ fontFamily: typography.headingFont }}>{name}</h3>
                    <span className="appearance-site-preview__product-link">{t("site.viewProduct")}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="appearance-site-preview__stats">
            <div>
              <strong>25+</strong>
              <span>{t("site.statsYears")}</span>
            </div>
            <div>
              <strong>500+</strong>
              <span>{t("site.statsClients")}</span>
            </div>
            <div>
              <strong>ISO</strong>
              <span>{t("site.statsQuality")}</span>
            </div>
          </section>

          <footer className="appearance-site-preview__footer">
            <span>{branding.brandName}</span>
            <small>{t("site.footer")}</small>
          </footer>
        </div>
      </div>
    </div>
  );
}
