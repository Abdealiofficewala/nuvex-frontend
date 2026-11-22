"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { ThemeDuplicateModal } from "@/components/admin/appearance/ThemeDuplicateModal";
import { AdminConfirmModal } from "@/components/admin/common/AdminConfirmModal";
import { AdminListingTable } from "@/components/admin/common/AdminListingTable";
import type { AdminTableColumn } from "@/components/admin/common/AdminTable";
import {
  AdminTableActivateIcon,
  AdminTableDeleteIcon,
  AdminTableDuplicateIcon,
  AdminTableViewIcon,
} from "@/components/admin/common/AdminTableActionIcons";
import { AdminTooltip } from "@/components/admin/common/AdminTooltip";
import { useToast } from "@/components/ui/toast";
import { APPEARANCE_UPDATED_EVENT, ROUTES, themeViewHref } from "@/lib/constants";
import { computeThemeLifecycleStatus } from "@/lib/theme/status";
import { appearanceService } from "@/services/appearance.service";
import type { ResolvedTheme, ThemeRecord } from "@/types/appearance";

type ThemeRow = ThemeRecord & { resolved: ResolvedTheme };

type ThemeActionButtonProps = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
};

function ThemeActionButton({ label, onClick, disabled = false, children }: ThemeActionButtonProps) {
  return (
    <AdminTooltip label={label} placement="top">
      <button
        type="button"
        className="admin-table-actions__btn"
        aria-label={label}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    </AdminTooltip>
  );
}

function ThemeActionGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="appearance-theme-row-actions__group">
      <span className="appearance-theme-row-actions__label">{label}</span>
      <div className="appearance-theme-row-actions__buttons">{children}</div>
    </div>
  );
}

function ThemeRowActions({ children }: { children: ReactNode }) {
  return <div className="appearance-theme-row-actions">{children}</div>;
}

export function ThemesListing() {
  const t = useTranslations("admin.appearance.themes");
  const toast = useToast();
  const router = useRouter();
  const [themes, setThemes] = useState<ThemeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<ThemeRow | null>(null);
  const [activateTarget, setActivateTarget] = useState<ThemeRow | null>(null);
  const [duplicateTarget, setDuplicateTarget] = useState<ThemeRow | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setThemes(await appearanceService.listThemes());
    } catch {
      toast.error(t("errors.title"), t("errors.load"));
    } finally {
      setLoading(false);
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

  async function handleDuplicateConfirm(values: { name: string; slug: string }) {
    if (!duplicateTarget) return;
    setActionLoading(true);
    try {
      await appearanceService.duplicateTheme(duplicateTarget.id, values);
      toast.success(t("duplicate.success.title"), t("duplicate.success.body"));
      setDuplicateTarget(null);
      await refresh();
    } catch {
      toast.error(t("errors.title"), t("errors.duplicate"));
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await appearanceService.deleteTheme(deleteTarget.id);
      toast.success(t("delete.success.title"), t("delete.success.body"));
      setDeleteTarget(null);
      await refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : t("errors.generic");
      toast.error(t("errors.title"), message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleActivateConfirm() {
    if (!activateTarget) return;
    setActionLoading(true);
    try {
      await appearanceService.activateTheme(activateTarget.id);
      toast.success(t("activate.success.title"), t("activate.success.body"));
      setActivateTarget(null);
      await refresh();
    } catch {
      toast.error(t("errors.title"), t("errors.activate"));
    } finally {
      setActionLoading(false);
    }
  }

  const columns = useMemo<AdminTableColumn<ThemeRow>[]>(
    () => [
      {
        key: "logo",
        header: t("table.logo"),
        render: (row) => (
          <div className="appearance-theme-cell__thumb">
            {row.resolved.branding.logo ? (
              <Image src={row.resolved.branding.logo} alt="" width={48} height={48} unoptimized />
            ) : null}
          </div>
        ),
      },
      {
        key: "name",
        header: t("table.name"),
        render: (row) => <strong>{row.name}</strong>,
      },
      {
        key: "palette",
        header: t("table.palette"),
        render: (row) => (
          <div className="appearance-palette-preview">
            {(["primary", "accent", "background", "surface", "text"] as const).map((key) => (
              <span key={key} style={{ background: row.resolved.colors[key] }} />
            ))}
          </div>
        ),
      },
      {
        key: "status",
        header: t("table.status"),
        render: (row) => {
          const status = computeThemeLifecycleStatus(row);
          return (
            <span className={status === "active" ? "appearance-status is-active" : "appearance-status"}>
              {t(`lifecycle.${status}` as "lifecycle.active")}
            </span>
          );
        },
      },
      {
        key: "font",
        header: t("table.font"),
        render: (row) => row.resolved.typography.headingFont.split(",")[0]?.replace(/"/g, "") ?? "—",
      },
      {
        key: "mode",
        header: t("table.mode"),
        render: (row) => t(`modes.${row.appearance?.colorScheme ?? "light"}`),
      },
      {
        key: "schedule",
        header: t("table.schedule"),
        render: (row) => {
          if (row.schedule.mode === "scheduled" && row.schedule.startDate && row.schedule.endDate) {
            return `${row.schedule.startDate} → ${row.schedule.endDate}`;
          }

          if (row.isFallback) {
            return t("schedule.fallback");
          }

          if (row.schedule.mode === "interval" || row.schedule.mode === "from_date") {
            return t("schedule.scheduled");
          }

          return t(`schedule.${row.schedule.mode}` as "schedule.manual");
        },
      },
      {
        key: "priority",
        header: t("table.priority"),
        render: (row) => row.schedule.priority ?? 0,
      },
      {
        key: "updated",
        header: t("table.updated"),
        render: (row) => new Date(row.updatedAt).toLocaleString(),
      },
      {
        key: "actions",
        header: t("table.actions"),
        variant: "actions",
        cellClassName: "appearance-themes-table__actions-cell",
        headerClassName: "appearance-themes-table__actions-cell",
        render: (row) => (
          <ThemeRowActions>
            <ThemeActionGroup label={t("table.actionsViewTheme")}>
              <ThemeActionButton label={t("actions.view")} onClick={() => router.push(themeViewHref(row.id))}>
                <AdminTableViewIcon />
              </ThemeActionButton>
              {!row.isActive ? (
                <ThemeActionButton label={t("actions.activate")} onClick={() => setActivateTarget(row)}>
                  <AdminTableActivateIcon />
                </ThemeActionButton>
              ) : null}
            </ThemeActionGroup>
            <ThemeActionGroup label={t("table.actionsUpdateTheme")}>
              <ThemeActionButton label={t("actions.duplicate")} onClick={() => setDuplicateTarget(row)}>
                <AdminTableDuplicateIcon />
              </ThemeActionButton>
              <ThemeActionButton
                label={row.isActive ? t("actions.deleteActiveHint") : t("actions.delete")}
                disabled={row.isActive}
                onClick={() => {
                  if (!row.isActive) {
                    setDeleteTarget(row);
                  }
                }}
              >
                <AdminTableDeleteIcon />
              </ThemeActionButton>
            </ThemeActionGroup>
          </ThemeRowActions>
        ),
      },
    ],
    [router, t],
  );

  return (
    <section className="appearance-themes">
      <AdminListingTable
        className="appearance-themes-table"
        columns={columns}
        rows={themes}
        rowKey={(row) => row.id}
        caption={t("table.caption")}
        loading={loading}
        toolbarTitle={t("toolbarTitle")}
        createHref={ROUTES.admin.theme.create}
        createLabel={t("createAction")}
      />

      <ThemeDuplicateModal
        open={Boolean(duplicateTarget)}
        source={duplicateTarget}
        loading={actionLoading}
        onConfirm={handleDuplicateConfirm}
        onClose={() => {
          if (!actionLoading) setDuplicateTarget(null);
        }}
      />

      <AdminConfirmModal
        open={Boolean(deleteTarget)}
        tone="caution"
        icon="hide"
        title={t("delete.confirm.title")}
        description={t("delete.confirm.description", { name: deleteTarget?.name ?? "" })}
        confirmLabel={t("delete.confirm.confirm")}
        loading={actionLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          if (!actionLoading) setDeleteTarget(null);
        }}
      />

      <AdminConfirmModal
        open={Boolean(activateTarget)}
        tone="default"
        icon="hide"
        title={t("activate.confirm.title")}
        description={t("activate.confirm.description", { name: activateTarget?.name ?? "" })}
        confirmLabel={t("activate.confirm.confirm")}
        loading={actionLoading}
        onConfirm={handleActivateConfirm}
        onCancel={() => {
          if (!actionLoading) setActivateTarget(null);
        }}
      />
    </section>
  );
}
