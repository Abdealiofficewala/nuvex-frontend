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
  AdminResourceViewTags,
} from "@/components/admin/common/AdminResourceViewDetail";
import { ROUTES, sectorEditHref } from "@/lib/constants";
import { formatDate, hasValue } from "@/lib/utils";
import { contentService } from "@/services/content.service";
import type { IndustryRecord, SectorRecord } from "@/types/content-admin";

type ViewSectorDetailProps = {
  id: string;
};

export function ViewSectorDetail({ id }: ViewSectorDetailProps) {
  const t = useTranslations("admin.industries.sectors.view");
  const locale = useLocale();
  const [sector, setSector] = useState<SectorRecord | null>(null);
  const [industry, setIndustry] = useState<IndustryRecord | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    contentService
      .getSector(id)
      .then(async (record) => {
        setSector(record);
        const parent = await contentService.getIndustry(record.industryId).catch(() => null);
        setIndustry(parent);
      })
      .catch(() => {
        setSector(null);
        setIndustry(null);
      })
      .finally(() => setLoaded(true));
  }, [id]);

  if (loaded && !sector) {
    return (
      <AdminResourceViewEmpty
        title={t("notFound.title")}
        body={t("notFound.body")}
        backHref={ROUTES.admin.industries.sectors}
        backLabel={t("cancelAction")}
      />
    );
  }

  if (!sector) {
    return null;
  }

  return (
    <AdminResourceViewShell className="admin-resource-view--banner">
      <AdminResourceViewHero
        imageSrc={sector.image}
        previewVariant="banner"
        emptyImageLabel={t("noImage")}
        title={sector.name}
        subtitle={hasValue(sector.summary) ? sector.summary : undefined}
        badges={
          <>
            {industry ? <span className="admin-resource-view__pill">{industry.name}</span> : null}
            <AdminStatusBadge
              active={sector.status === "active"}
              activeLabel={t("status.active")}
              inactiveLabel={t("status.draft")}
            />
          </>
        }
      />

      <AdminResourceViewGrid>
        <AdminResourceViewField label={t("fields.slug")}>
          <code className="admin-table__code">{sector.slug}</code>
        </AdminResourceViewField>
        <AdminResourceViewField label={t("fields.industry")}>
          {industry?.name ?? "—"}
        </AdminResourceViewField>
        <AdminResourceViewField label={t("fields.created")}>
          <time dateTime={sector.createdAt}>{formatDate(sector.createdAt, locale)}</time>
        </AdminResourceViewField>
        <AdminResourceViewField label={t("fields.updated")}>
          <time dateTime={sector.updatedAt}>{formatDate(sector.updatedAt, locale)}</time>
        </AdminResourceViewField>
        <AdminResourceViewField label={t("fields.description")} wide valueClassName="admin-resource-view__body">
          {sector.description || "—"}
        </AdminResourceViewField>
        <AdminResourceViewField label={t("fields.applications")} wide>
          <AdminResourceViewTags items={sector.applications} />
        </AdminResourceViewField>
      </AdminResourceViewGrid>

      <AdminResourceViewActions
        cancelHref={ROUTES.admin.industries.sectors}
        cancelLabel={t("cancelAction")}
        editHref={sectorEditHref(sector.id)}
        editLabel={t("editAction")}
      />
    </AdminResourceViewShell>
  );
}
