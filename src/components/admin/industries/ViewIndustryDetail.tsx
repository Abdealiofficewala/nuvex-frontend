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
import { ButtonLink } from "@/components/ui/buttons";
import {
  industryEditHref,
  industryManageSectorsHref,
  ROUTES,
  sectorCreateHref,
} from "@/lib/constants";
import { formatDate, hasValue } from "@/lib/utils";
import { contentService } from "@/services/content.service";
import type { IndustryRecord, SectorRecord } from "@/types/content-admin";
import { SectorsListing } from "./SectorsListing";

type ViewIndustryDetailProps = {
  id: string;
  showSectors?: boolean;
};

export function ViewIndustryDetail({ id, showSectors = true }: ViewIndustryDetailProps) {
  const t = useTranslations("admin.industries.listing.view");
  const locale = useLocale();
  const [industry, setIndustry] = useState<IndustryRecord | null>(null);
  const [sectors, setSectors] = useState<SectorRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      contentService.getIndustry(id),
      contentService.listSectors({ industryId: id }),
    ])
      .then(([record, sectorItems]) => {
        setIndustry(record);
        setSectors(sectorItems);
      })
      .catch(() => {
        setIndustry(null);
        setSectors([]);
      })
      .finally(() => setLoaded(true));
  }, [id]);

  if (loaded && !industry) {
    return (
      <AdminResourceViewEmpty
        title={t("notFound.title")}
        body={t("notFound.body")}
        backHref={ROUTES.admin.industries.listing}
        backLabel={t("cancelAction")}
      />
    );
  }

  if (!industry) {
    return null;
  }

  return (
    <div className="admin-industry-view-stack">
      <AdminResourceViewShell className="admin-resource-view--banner">
        <AdminResourceViewHero
          imageSrc={industry.image}
          previewVariant="banner"
          emptyImageLabel={t("noImage")}
          title={industry.name}
          subtitle={hasValue(industry.summary) ? industry.summary : undefined}
          badges={
            <AdminStatusBadge
              active={industry.status === "active"}
              activeLabel={t("status.active")}
              inactiveLabel={t("status.draft")}
            />
          }
        />

        <AdminResourceViewGrid>
          <AdminResourceViewField label={t("fields.slug")}>
            <code className="admin-table__code">{industry.slug}</code>
          </AdminResourceViewField>
          <AdminResourceViewField label={t("fields.sectors")}>{sectors.length}</AdminResourceViewField>
          <AdminResourceViewField label={t("fields.created")}>
            <time dateTime={industry.createdAt}>{formatDate(industry.createdAt, locale)}</time>
          </AdminResourceViewField>
          <AdminResourceViewField label={t("fields.updated")}>
            <time dateTime={industry.updatedAt}>{formatDate(industry.updatedAt, locale)}</time>
          </AdminResourceViewField>
          <AdminResourceViewField label={t("fields.description")} wide valueClassName="admin-resource-view__body">
            {industry.description || "—"}
          </AdminResourceViewField>
        </AdminResourceViewGrid>

        <div className="admin-page-actions admin-page-actions--form">
          <ButtonLink
            href={ROUTES.admin.industries.listing}
            variant="secondary"
            className="admin-page-actions__btn admin-page-actions__btn--reset"
          >
            {t("cancelAction")}
          </ButtonLink>
          <ButtonLink
            href={industryManageSectorsHref(industry.id)}
            variant="secondary"
            className="admin-page-actions__btn"
          >
            {t("manageSectorsAction")}
          </ButtonLink>
          <ButtonLink
            href={sectorCreateHref(industry.id)}
            variant="secondary"
            className="admin-page-actions__btn"
          >
            {t("addSectorAction")}
          </ButtonLink>
          <ButtonLink
            href={industryEditHref(industry.id)}
            variant="accent"
            className="admin-page-actions__btn admin-page-actions__btn--save"
          >
            {t("editAction")}
          </ButtonLink>
        </div>
      </AdminResourceViewShell>

      {showSectors ? (
        <section className="admin-industry-view-stack__sectors">
          <div className="admin-industry-view-stack__sectors-head">
            <h2 className="admin-industry-view-stack__sectors-title">{t("sectorsTitle")}</h2>
            <ButtonLink href={sectorCreateHref(industry.id)} variant="accent" className="admin-page-toolbar__action">
              {t("addSectorAction")}
            </ButtonLink>
          </div>
          <SectorsListing industryId={industry.id} embedded />
        </section>
      ) : null}
    </div>
  );
}
