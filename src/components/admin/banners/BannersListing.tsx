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
import { useToast } from "@/components/ui/toast";
import { useAdminResourceListing } from "@/lib/admin/use-admin-resource-listing";
import { ROUTES, bannerEditHref, bannerViewHref } from "@/lib/constants";
import { formatDate, hasValue } from "@/lib/utils";
import { findWebsiteModuleLabelKey, type WebsiteModuleLabelKey } from "@/lib/website-modules";
import { contentService } from "@/services/content.service";
import type { BannerRecord } from "@/types/content-admin";

function resolvePageLabel(
  row: BannerRecord,
  tModules: (key: WebsiteModuleLabelKey) => string,
) {
  const labelKey = findWebsiteModuleLabelKey(row.pageRoute);
  return labelKey ? tModules(labelKey) : row.pageRoute;
}

export function BannersListing() {
  const t = useTranslations("admin.hero.banners");
  const tModules = useTranslations("admin.hero.banners.modules");
  const locale = useLocale();
  const toast = useToast();
  const [deleteTarget, setDeleteTarget] = useState<BannerRecord | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const onLoadError = useCallback(() => {
    toast.error(t("errors.title"), t("errors.load"));
  }, [t, toast]);

  const { items, listLoading, refresh } = useAdminResourceListing({
    load: contentService.listBanners,
    onLoadError,
  });

  async function handleDeleteConfirm() {
    if (!deleteTarget) {
      return;
    }

    setDeleteLoading(true);

    try {
      await contentService.deleteBanner(deleteTarget.id);
      toast.success(t("delete.success.title"), t("delete.success.body"));
      setDeleteTarget(null);
      await refresh();
    } catch (error) {
      toast.error(t("errors.title"), error instanceof Error ? error.message : t("errors.generic"));
    } finally {
      setDeleteLoading(false);
    }
  }

  const columns = useMemo<AdminTableColumn<BannerRecord>[]>(
    () => [
      {
        key: "banner",
        header: t("table.banner"),
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
              <AdminTooltip label={row.title} className="admin-tooltip-trigger--fit">
                <strong className="admin-table__cell-text">{row.title}</strong>
              </AdminTooltip>
              {hasValue(row.eyebrow) ? (
                <AdminTooltip label={row.eyebrow} className="admin-tooltip-trigger--fit">
                  <span className="admin-table__cell-text">{row.eyebrow}</span>
                </AdminTooltip>
              ) : (
                <span className="admin-table__muted">{t("table.noEyebrow")}</span>
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
        key: "body",
        header: t("table.description"),
        variant: "description",
        render: (row) =>
          hasValue(row.body) ? (
            <AdminTooltip label={row.body} className="admin-tooltip-trigger--fit">
              <span className="admin-table__description admin-table__cell-text">{row.body}</span>
            </AdminTooltip>
          ) : (
            <span className="admin-table__muted">—</span>
          ),
      },
      {
        key: "page",
        header: t("table.page"),
        cellClassName: "admin-table__page-cell",
        render: (row) => {
          const pageLabel = resolvePageLabel(row, tModules);

          return (
            <AdminTooltip label={pageLabel} className="admin-tooltip-trigger--block">
              <span className="admin-table__cell-text admin-table__label">{pageLabel}</span>
            </AdminTooltip>
          );
        },
      },
      {
        key: "path",
        header: t("table.path"),
        cellClassName: "admin-table__path-cell",
        render: (row) => (
          <AdminTooltip label={row.pageRoute} className="admin-tooltip-trigger--block">
            <code className="admin-table__code admin-table__cell-text">{row.pageRoute}</code>
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
          <AdminTooltip label={formatDate(row.updatedAt, locale)} className="admin-tooltip-trigger--fit">
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
            viewHref={bannerViewHref(row.id)}
            editHref={bannerEditHref(row.id)}
            viewLabel={t("actions.view")}
            editLabel={t("actions.edit")}
            deleteLabel={t("actions.delete")}
            onDelete={() => setDeleteTarget(row)}
          />
        ),
      },
    ],
    [locale, t, tModules],
  );

  return (
    <section className="admin-banners-listing">
      <AdminListingTable
        columns={columns}
        rows={items}
        rowKey={(row) => row.id}
        caption={t("table.caption")}
        loading={listLoading}
        toolbarTitle={t("toolbarTitle")}
        createHref={ROUTES.admin.banners.create}
        createLabel={t("createAction")}
      />

      <AdminConfirmModal
        open={Boolean(deleteTarget)}
        tone="caution"
        icon="hide"
        title={t("delete.confirm.title")}
        description={t("delete.confirm.description", { name: deleteTarget?.title ?? "" })}
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
