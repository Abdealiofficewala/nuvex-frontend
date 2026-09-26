"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { AdminConfirmModal } from "@/components/admin/common/AdminConfirmModal";
import { AdminTableActions } from "@/components/admin/common/AdminTableActions";
import { AdminListingTable } from "@/components/admin/common/AdminListingTable";
import type { AdminTableColumn } from "@/components/admin/common/AdminTable";
import { useToast } from "@/components/ui/toast";
import {
  APPEARANCE_UPDATED_EVENT,
  ROUTES,
  colorPaletteEditHref,
  colorPaletteViewHref,
} from "@/lib/constants";
import { appearanceService } from "@/services/appearance.service";
import type { ColorPaletteRecord } from "@/types/appearance";

export function ColorPalettesListing() {
  const t = useTranslations("admin.appearance.colors");
  const toast = useToast();
  const [items, setItems] = useState<ColorPaletteRecord[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<ColorPaletteRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);

  const refresh = useCallback(async () => {
    setListLoading(true);
    try {
      setItems(await appearanceService.listColorPalettes());
    } catch {
      toast.error(t("errors.title"), t("errors.load"));
    } finally {
      setListLoading(false);
    }
  }, [t, toast]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      void refresh();
    });
    const onUpdated = () => void refresh();
    window.addEventListener(APPEARANCE_UPDATED_EVENT, onUpdated);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener(APPEARANCE_UPDATED_EVENT, onUpdated);
    };
  }, [refresh]);

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setLoading(true);
    try {
      await appearanceService.deleteColorPalette(deleteTarget.id);
      toast.success(t("delete.success.title"), t("delete.success.body"));
      setDeleteTarget(null);
      await refresh();
    } catch (error) {
      toast.error(t("errors.title"), error instanceof Error ? error.message : t("errors.generic"));
    } finally {
      setLoading(false);
    }
  }

  const columns = useMemo<AdminTableColumn<ColorPaletteRecord>[]>(
    () => [
      {
        key: "name",
        header: t("table.name"),
        render: (row) => <strong>{row.name}</strong>,
      },
      {
        key: "slug",
        header: t("table.slug"),
        render: (row) => row.slug,
      },
      {
        key: "palette",
        header: t("table.palette"),
        render: (row) => (
          <div className="appearance-palette-preview">
            {(["primary", "accent", "background", "surface", "text"] as const).map((key) => (
              <span key={key} style={{ background: row.colors[key] }} />
            ))}
          </div>
        ),
      },
      {
        key: "actions",
        header: t("table.actions"),
        variant: "actions",
        render: (row) => (
          <AdminTableActions
            viewHref={colorPaletteViewHref(row.id)}
            editHref={colorPaletteEditHref(row.id)}
            viewLabel={t("actions.view")}
            editLabel={t("actions.edit")}
            deleteLabel={t("actions.delete")}
            onDelete={() => setDeleteTarget(row)}
          />
        ),
      },
    ],
    [t],
  );

  return (
    <section>
      <AdminListingTable
        columns={columns}
        rows={items}
        rowKey={(row) => row.id}
        caption={t("table.caption")}
        loading={listLoading}
        toolbarTitle={t("toolbarTitle")}
        createHref={ROUTES.admin.theme.colorsCreate}
        createLabel={t("createAction")}
      />

      <AdminConfirmModal
        open={Boolean(deleteTarget)}
        tone="caution"
        icon="hide"
        title={t("delete.confirm.title")}
        description={t("delete.confirm.description", { name: deleteTarget?.name ?? "" })}
        confirmLabel={t("delete.confirm.confirm")}
        loading={loading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          if (!loading) setDeleteTarget(null);
        }}
      />
    </section>
  );
}
