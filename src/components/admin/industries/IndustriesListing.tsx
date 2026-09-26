"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AdminConfirmModal } from "@/components/admin/common/AdminConfirmModal";
import { AdminListingTable } from "@/components/admin/common/AdminListingTable";
import { AdminStatusBadge } from "@/components/admin/common/AdminStatusBadge";
import type { AdminTableColumn } from "@/components/admin/common/AdminTable";
import { AdminTableActions } from "@/components/admin/common/AdminTableActions";
import { AdminTooltip } from "@/components/admin/common/AdminTooltip";
import { Link } from "@/i18n/routing";
import { useToast } from "@/components/ui/toast";
import { useAdminResourceListing } from "@/lib/admin/use-admin-resource-listing";
import {
  industryEditHref,
  industryManageSectorsHref,
  industryViewHref,
  ROUTES,
} from "@/lib/constants";
import { formatDate, hasValue } from "@/lib/utils";
import { contentService } from "@/services/content.service";
import type { IndustryRecord, SectorRecord } from "@/types/content-admin";

type IndustryRow = IndustryRecord & {
  sectorCount: number;
};

export function IndustriesListing() {
  const t = useTranslations("admin.industries.listing");
  const locale = useLocale();
  const toast = useToast();
  const [deleteTarget, setDeleteTarget] = useState<IndustryRecord | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [sectors, setSectors] = useState<SectorRecord[]>([]);

  const onLoadError = useCallback(() => {
    toast.error(t("errors.title"), t("errors.load"));
  }, [t, toast]);

  const loadIndustries = useCallback(async () => {
    const [industries, sectorItems] = await Promise.all([
      contentService.listIndustries(),
      contentService.listSectors(),
    ]);
    setSectors(sectorItems);
    return industries;
  }, []);

  const { items, listLoading, refresh } = useAdminResourceListing({
    load: loadIndustries,
    onLoadError,
  });

  const rows = useMemo<IndustryRow[]>(() => {
    const counts = sectors.reduce<Record<string, number>>((acc, sector) => {
      acc[sector.industryId] = (acc[sector.industryId] ?? 0) + 1;
      return acc;
    }, {});

    return items.map((item) => ({
      ...item,
      sectorCount: counts[item.id] ?? 0,
    }));
  }, [items, sectors]);

  async function handleDeleteConfirm() {
    if (!deleteTarget) {
      return;
    }

    setDeleteLoading(true);

    try {
      await contentService.deleteIndustry(deleteTarget.id);
      toast.success(t("delete.success.title"), t("delete.success.body"));
      setDeleteTarget(null);
      await refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : t("errors.generic");
      toast.error(t("errors.title"), message.includes("in use") ? t("errors.inUse") : message);
    } finally {
      setDeleteLoading(false);
    }
  }

  const columns = useMemo<AdminTableColumn<IndustryRow>[]>(
    () => [
      {
        key: "industry",
        header: t("table.industry"),
        variant: "member",
        render: (row) => (
          <div className="admin-table-member admin-banner-table-member">
            <span className="admin-banner-table-member__thumb" aria-hidden="true">
              {row.image ? (
                row.image.startsWith("data:") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={row.image} alt="" className="admin-banner-table-member__image" />
                ) : (
                  <Image
                    src={row.image}
                    alt=""
                    fill
                    sizes="72px"
                    unoptimized
                    className="admin-banner-table-member__image"
                  />
                )
              ) : (
                <span className="admin-banner-table-member__placeholder">{t("table.noImage")}</span>
              )}
            </span>
            <div className="admin-table-member__copy">
              <AdminTooltip label={row.name} className="admin-tooltip-trigger--block">
                <strong className="admin-table__cell-text">{row.name}</strong>
              </AdminTooltip>
              {hasValue(row.summary) ? (
                <AdminTooltip label={row.summary} className="admin-tooltip-trigger--block">
                  <span className="admin-table__cell-text">{row.summary}</span>
                </AdminTooltip>
              ) : (
                <span className="admin-table__muted">{t("table.noSummary")}</span>
              )}
            </div>
          </div>
        ),
      },
      {
        key: "slug",
        header: t("table.slug"),
        cellClassName: "admin-table__slug-cell",
        render: (row) => (
          <AdminTooltip label={row.slug} className="admin-tooltip-trigger--block">
            <code className="admin-table__code admin-table__cell-text">{row.slug}</code>
          </AdminTooltip>
        ),
      },
      {
        key: "sectors",
        header: t("table.sectors"),
        render: (row) => <span className="admin-table__cell-text">{row.sectorCount}</span>,
      },
      {
        key: "status",
        header: t("table.status"),
        variant: "status",
        render: (row) => (
          <AdminStatusBadge
            active={row.status === "active"}
            activeLabel={t("status.active")}
            inactiveLabel={t("status.draft")}
          />
        ),
      },
      {
        key: "updatedAt",
        header: t("table.updated"),
        render: (row) => (
          <AdminTooltip label={formatDate(row.updatedAt, locale)} className="admin-tooltip-trigger--block">
            <time className="admin-table__cell-text" dateTime={row.updatedAt}>
              {formatDate(row.updatedAt, locale)}
            </time>
          </AdminTooltip>
        ),
      },
      {
        key: "actions",
        header: t("table.actions"),
        variant: "actions",
        render: (row) => (
          <div className="admin-table-actions">
            <AdminTableActions
              viewHref={industryViewHref(row.id)}
              editHref={industryEditHref(row.id)}
              viewLabel={t("actions.view")}
              editLabel={t("actions.edit")}
              deleteLabel={t("actions.delete")}
              onDelete={() => setDeleteTarget(row)}
              deleteDisabled={row.sectorCount > 0}
            />
            <AdminTooltip label={t("actions.manageSectors")} placement="top">
              <Link
                href={industryManageSectorsHref(row.id)}
                className="admin-table-actions__btn"
                aria-label={t("actions.manageSectors")}
              >
                <span className="admin-table-actions__manage-icon" aria-hidden="true">
                  ≡
                </span>
              </Link>
            </AdminTooltip>
          </div>
        ),
      },
    ],
    [locale, t],
  );

  return (
    <section className="admin-industries-listing">
      <AdminListingTable
        columns={columns}
        rows={rows}
        rowKey={(row) => row.id}
        caption={t("table.caption")}
        loading={listLoading}
        toolbarTitle={t("toolbarTitle")}
        createHref={ROUTES.admin.industries.create}
        createLabel={t("createAction")}
      />

      <AdminConfirmModal
        open={Boolean(deleteTarget)}
        tone="caution"
        icon="hide"
        title={t("delete.confirm.title")}
        description={t("delete.confirm.description", { name: deleteTarget?.name ?? "" })}
        confirmLabel={t("delete.confirm.confirm")}
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          if (!deleteLoading) {
            setDeleteTarget(null);
          }
        }}
      />
    </section>
  );
}
