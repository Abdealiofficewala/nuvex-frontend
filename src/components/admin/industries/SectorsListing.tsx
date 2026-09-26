"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AdminConfirmModal } from "@/components/admin/common/AdminConfirmModal";
import {
  AdminListingFilterModal,
  type AdminListingFilterField,
} from "@/components/admin/common/AdminListingFilterModal";
import { AdminListingFilterTrigger } from "@/components/admin/common/AdminListingFilterTrigger";
import { AdminListingTable } from "@/components/admin/common/AdminListingTable";
import { AdminStatusBadge } from "@/components/admin/common/AdminStatusBadge";
import type { AdminTableColumn } from "@/components/admin/common/AdminTable";
import { AdminTableActions } from "@/components/admin/common/AdminTableActions";
import { AdminTooltip } from "@/components/admin/common/AdminTooltip";
import { ButtonLink } from "@/components/ui/buttons";
import { useToast } from "@/components/ui/toast";
import { countActiveListingFilters } from "@/lib/admin/listing-filters";
import { useAdminResourceListing } from "@/lib/admin/use-admin-resource-listing";
import {
  ROUTES,
  sectorCreateHref,
  sectorEditHref,
  sectorViewHref,
} from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { contentService } from "@/services/content.service";
import type { IndustryRecord, SectorRecord } from "@/types/content-admin";

type SectorRow = SectorRecord & {
  industryName: string;
};

type SectorsListingProps = {
  industryId?: string;
  embedded?: boolean;
};

export function SectorsListing({ industryId, embedded = false }: SectorsListingProps) {
  const t = useTranslations("admin.industries.sectors");
  const locale = useLocale();
  const toast = useToast();
  const [deleteTarget, setDeleteTarget] = useState<SectorRecord | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [industries, setIndustries] = useState<IndustryRecord[]>([]);
  const [industryFilter, setIndustryFilter] = useState(industryId ?? "");
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    contentService
      .listIndustries()
      .then(setIndustries)
      .catch(() => setIndustries([]));
  }, []);

  useEffect(() => {
    if (industryId) {
      setIndustryFilter(industryId);
    }
  }, [industryId]);

  const onLoadError = useCallback(() => {
    toast.error(t("errors.title"), t("errors.load"));
  }, [t, toast]);

  const loadSectors = useCallback(
    () => contentService.listSectors(industryId ? { industryId } : undefined),
    [industryId],
  );

  const { items, listLoading, refresh } = useAdminResourceListing({
    load: loadSectors,
    onLoadError,
    deps: [industryId],
  });

  const industryMap = useMemo(
    () => new Map(industries.map((item) => [item.id, item.name])),
    [industries],
  );

  const rows = useMemo<SectorRow[]>(() => {
    const mapped = items.map((item) => ({
      ...item,
      industryName: industryMap.get(item.industryId) ?? "—",
    }));

    if (embedded || !industryFilter) {
      return mapped;
    }

    return mapped.filter((item) => item.industryId === industryFilter);
  }, [embedded, industryFilter, industryMap, items]);

  const filterFields = useMemo<AdminListingFilterField[]>(
    () => [
      {
        id: "industry",
        label: t("filters.industry"),
        value: industryFilter,
        defaultValue: "",
        options: [
          { value: "", label: t("filters.allIndustries") },
          ...industries.map((item) => ({ value: item.id, label: item.name })),
        ],
      },
    ],
    [industries, industryFilter, t],
  );

  const activeFilterCount = countActiveListingFilters(filterFields);

  async function handleDeleteConfirm() {
    if (!deleteTarget) {
      return;
    }

    setDeleteLoading(true);

    try {
      await contentService.deleteSector(deleteTarget.id);
      toast.success(t("delete.success.title"), t("delete.success.body"));
      setDeleteTarget(null);
      await refresh();
    } catch (error) {
      toast.error(t("errors.title"), error instanceof Error ? error.message : t("errors.generic"));
    } finally {
      setDeleteLoading(false);
    }
  }

  const columns = useMemo<AdminTableColumn<SectorRow>[]>(
    () => [
      {
        key: "sector",
        header: t("table.sector"),
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
              <AdminTooltip label={row.summary || "—"} className="admin-tooltip-trigger--block">
                <span className="admin-table__cell-text">{row.summary || "—"}</span>
              </AdminTooltip>
            </div>
          </div>
        ),
      },
      ...(embedded
        ? []
        : ([
            {
              key: "industry",
              header: t("table.industry"),
              render: (row) => (
                <AdminTooltip label={row.industryName} className="admin-tooltip-trigger--block">
                  <span className="admin-table__cell-text admin-table__label">{row.industryName}</span>
                </AdminTooltip>
              ),
            },
          ] as AdminTableColumn<SectorRow>[])),
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
          <AdminTableActions
            viewHref={sectorViewHref(row.id)}
            editHref={sectorEditHref(row.id)}
            viewLabel={t("actions.view")}
            editLabel={t("actions.edit")}
            deleteLabel={t("actions.delete")}
            onDelete={() => setDeleteTarget(row)}
          />
        ),
      },
    ],
    [embedded, locale, t],
  );

  return (
    <section className="admin-sectors-listing">
      <AdminListingTable
        columns={columns}
        rows={rows}
        rowKey={(row) => row.id}
        caption={t("table.caption")}
        loading={listLoading}
        toolbarTitle={embedded ? t("embedded.toolbarTitle") : t("toolbarTitle")}
        createHref={sectorCreateHref((industryId ?? industryFilter) || undefined)}
        createLabel={t("createAction")}
        toolbarAction={
          embedded ? undefined : (
            <div className="admin-table-panel__toolbar-actions">
              <AdminListingFilterTrigger
                activeCount={activeFilterCount}
                onClick={() => setFilterOpen(true)}
              />
              <ButtonLink
                href={sectorCreateHref((industryId ?? industryFilter) || undefined)}
                variant="accent"
                className="admin-page-toolbar__action"
              >
                {t("createAction")}
              </ButtonLink>
            </div>
          )
        }
      />

      {!embedded ? (
        <AdminListingFilterModal
          open={filterOpen}
          title={t("filters.modalTitle")}
          description={t("filters.modalDescription")}
          fields={filterFields}
          onApply={(values) => {
            setIndustryFilter(values.industry ?? "");
            setFilterOpen(false);
          }}
          onClose={() => setFilterOpen(false)}
        />
      ) : null}

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
