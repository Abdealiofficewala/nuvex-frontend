"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AdminStatusBadge } from "@/components/admin/common/AdminStatusBadge";
import {
  AdminResourceViewActions,
  AdminResourceViewEmpty,
  AdminResourceViewField,
  AdminResourceViewGrid,
  AdminResourceViewHero,
  AdminResourceViewShell,
} from "@/components/admin/common/AdminResourceViewDetail";
import { ROUTES, bannerEditHref } from "@/lib/constants";
import { formatDate, hasValue } from "@/lib/utils";
import { findWebsiteModuleLabelKey } from "@/lib/website-modules";
import { contentService } from "@/services/content.service";
import type { BannerRecord } from "@/types/content-admin";

type ViewBannerDetailProps = {
  id: string;
};

export function ViewBannerDetail({ id }: ViewBannerDetailProps) {
  const t = useTranslations("admin.hero.banners.view");
  const tModules = useTranslations("admin.hero.banners.modules");
  const locale = useLocale();
  const [banner, setBanner] = useState<BannerRecord | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    contentService
      .getBanner(id)
      .then(setBanner)
      .catch(() => setBanner(null))
      .finally(() => setLoaded(true));
  }, [id]);

  if (loaded && !banner) {
    return (
      <AdminResourceViewEmpty
        title={t("notFound.title")}
        body={t("notFound.body")}
        backHref={ROUTES.admin.banners.listing}
        backLabel={t("cancelAction")}
      />
    );
  }

  if (!banner) {
    return null;
  }

  const pageLabelKey = findWebsiteModuleLabelKey(banner.pageRoute);
  const pageLabel = pageLabelKey ? tModules(pageLabelKey) : banner.pageRoute;

  return (
    <AdminResourceViewShell className="admin-resource-view--banner">
      <AdminResourceViewHero
        imageSrc={banner.image}
        previewVariant="banner"
        emptyImageLabel={t("noImage")}
        eyebrow={hasValue(banner.eyebrow) ? banner.eyebrow : undefined}
        title={banner.title}
        badges={
          <>
            <span className="admin-resource-view__pill">{pageLabel}</span>
            <AdminStatusBadge
              active={banner.status === "active"}
              activeLabel={t("status.active")}
              inactiveLabel={t("status.draft")}
            />
          </>
        }
      />

      <AdminResourceViewGrid>
        <AdminResourceViewField label={t("fields.slug")}>
          <code className="admin-table__code">{banner.slug}</code>
        </AdminResourceViewField>
        <AdminResourceViewField label={t("fields.page")}>{pageLabel}</AdminResourceViewField>
        <AdminResourceViewField label={t("fields.path")}>
          <code className="admin-table__code">{banner.pageRoute}</code>
        </AdminResourceViewField>
        <AdminResourceViewField label={t("fields.created")}>
          <time dateTime={banner.createdAt}>{formatDate(banner.createdAt, locale)}</time>
        </AdminResourceViewField>
        <AdminResourceViewField label={t("fields.updated")}>
          <time dateTime={banner.updatedAt}>{formatDate(banner.updatedAt, locale)}</time>
        </AdminResourceViewField>
        <AdminResourceViewField label={t("fields.body")} wide valueClassName="admin-resource-view__body">
          {banner.body || "—"}
        </AdminResourceViewField>
      </AdminResourceViewGrid>

      <AdminResourceViewActions
        cancelHref={ROUTES.admin.banners.listing}
        cancelLabel={t("cancelAction")}
        editHref={bannerEditHref(banner.id)}
        editLabel={t("editAction")}
      />
    </AdminResourceViewShell>
  );
}
