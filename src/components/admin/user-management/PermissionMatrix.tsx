"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/buttons";
import { AdminFormField } from "@/components/admin/common/AdminFormField";
import { ADMIN_ACCESS_MENU_MODULES, type AdminAccessMenuModuleId } from "@/lib/admin-menu";
import {
  ROLE_MATRIX_PERMISSIONS,
  applyRoleModulePermission,
  clearAllRolePermissions,
  clearRoleModule,
  enableAllForRoleModule,
  isAllModulesPermissionEnabled,
  isRoleModulePermissionEnabled,
  toggleAllModulesForPermission,
  summarizeRolePermissions,
  type RoleMatrixPermission,
} from "@/lib/admin-role-permissions";
import { getDefaultPageAccess, type AdminUserPageAccess } from "@/lib/admin-page-access.config";
import { cn } from "@/lib/utils";

type PermissionMatrixProps = {
  value: AdminUserPageAccess;
  disabled?: boolean;
  readOnly?: boolean;
  showBulkControls?: boolean;
  showCoverageSummary?: boolean;
  onChange?: (access: AdminUserPageAccess) => void;
};

function ViewPermIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2.75 12s3.8-7 9.25-7 9.25 7 9.25 7-3.8 7-9.25 7-9.25-7-9.25-7Z"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.85" />
    </svg>
  );
}

function CreatePermIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 8v8M8 12h8"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
      />
      <rect x="4.5" y="4.5" width="15" height="15" rx="4" stroke="currentColor" strokeWidth="1.85" />
    </svg>
  );
}

function EditPermIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m14.8 5.2 4 4M6 20h4l9.2-9.2a1.5 1.5 0 0 0 0-2.12l-1.08-1.08a1.5 1.5 0 0 0-2.12 0L6 16.8V20Z"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DeletePermIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9.5 6.5h5" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" />
      <path
        d="M7 8.5h10l-.85 11H7.85L7 8.5Z"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinejoin="round"
      />
      <path d="M10 11v5.5M14 11v5.5" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" />
    </svg>
  );
}

function ActionsHeadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 7h14M5 12h14M5 17h14" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" />
      <circle cx="9" cy="7" r="1.6" fill="currentColor" />
      <circle cx="15" cy="12" r="1.6" fill="currentColor" />
      <circle cx="11" cy="17" r="1.6" fill="currentColor" />
    </svg>
  );
}

function EnableRowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12.5 9.2 16.5 19 7.5"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClearRowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" />
    </svg>
  );
}

const PERM_ICONS: Record<RoleMatrixPermission, () => ReactNode> = {
  view: ViewPermIcon,
  create: CreatePermIcon,
  edit: EditPermIcon,
  delete: DeletePermIcon,
};

type RolePermissionSummary = ReturnType<typeof summarizeRolePermissions>;

export type PermissionCoverageVariant = "default" | "sidebar";

export function PermissionCoverageSummary({
  summary,
  t,
  variant = "default",
  className,
}: {
  summary: RolePermissionSummary;
  t: ReturnType<typeof useTranslations<"admin.users.access">>;
  variant?: PermissionCoverageVariant;
  className?: string;
}) {
  const total = summary.moduleTotal;
  const viewPercent = total > 0 ? Math.round((summary.modulesWithView / total) * 100) : 0;
  const ringRadius = 42;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - viewPercent / 100);

  return (
    <header
      className={cn(
        "admin-um-perm-coverage",
        variant === "sidebar" && "admin-um-perm-coverage--sidebar",
        className,
      )}
    >
      <div className="admin-um-perm-coverage__hero">
        <div
          className="admin-um-perm-coverage__ring"
          role="img"
          aria-label={t("matrixSummary.ringAria", {
            percent: viewPercent,
            enabled: summary.modulesWithView,
            total,
          })}
        >
          <svg viewBox="0 0 100 100" className="admin-um-perm-coverage__ring-svg" aria-hidden="true">
            <circle
              className="admin-um-perm-coverage__ring-track"
              cx="50"
              cy="50"
              r={ringRadius}
              fill="none"
            />
            <circle
              className="admin-um-perm-coverage__ring-progress"
              cx="50"
              cy="50"
              r={ringRadius}
              fill="none"
              strokeDasharray={ringCircumference}
              strokeDashoffset={ringOffset}
            />
          </svg>
          <div className="admin-um-perm-coverage__ring-center">
            <span className="admin-um-perm-coverage__ring-value">{viewPercent}%</span>
            <span className="admin-um-perm-coverage__ring-hint">{t("permissions.view")}</span>
          </div>
        </div>

        <div className="admin-um-perm-coverage__copy">
          <p className="admin-um-perm-coverage__title">{t("matrixSummary.title")}</p>
          <p className="admin-um-perm-coverage__meta">
            {t("matrixSummary.modules", {
              enabled: summary.modulesWithView,
              total,
            })}
          </p>
          {summary.modulesFull > 0 ? (
            <p className="admin-um-perm-coverage__meta admin-um-perm-coverage__meta--accent">
              {t("matrixSummary.fullAccess", { count: summary.modulesFull, total })}
            </p>
          ) : null}
        </div>
      </div>

      <ul className="admin-um-perm-coverage__metrics">
        {ROLE_MATRIX_PERMISSIONS.map((permission) => {
          const count = summary[permission];
          const percent = total > 0 ? Math.round((count / total) * 100) : 0;
          const Icon = PERM_ICONS[permission];

          return (
            <li
              key={permission}
              className={cn(
                "admin-um-perm-coverage__metric",
                `admin-um-perm-coverage__metric--${permission}`,
                count > 0 && "has-value",
              )}
            >
              <span className="admin-um-perm-coverage__metric-icon" aria-hidden="true">
                <Icon />
              </span>
              <div className="admin-um-perm-coverage__metric-body">
                <span className="admin-um-perm-coverage__metric-label">
                  {t(`permissions.${permission}`)}
                </span>
                <span className="admin-um-perm-coverage__metric-count">
                  <strong>{count}</strong>
                  <span className="admin-um-perm-coverage__metric-of">/</span>
                  {total}
                </span>
              </div>
              <div className="admin-um-perm-coverage__metric-bar" aria-hidden="true">
                <span
                  className="admin-um-perm-coverage__metric-bar-fill"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </header>
  );
}

type PermissionColumnKind = RoleMatrixPermission | "actions";

function PermissionColumnHead({
  kind,
  title,
  ariaLabel,
  checked = false,
  interactive = false,
  disabled = false,
  onToggle,
}: {
  kind: PermissionColumnKind;
  title: string;
  ariaLabel?: string;
  checked?: boolean;
  interactive?: boolean;
  disabled?: boolean;
  onToggle?: () => void;
}) {
  const Icon = kind === "actions" ? ActionsHeadIcon : PERM_ICONS[kind];
  const content = (
    <>
      <span className={cn("admin-um-perm-col-head__icon", `admin-um-perm-col-head__icon--${kind}`)}>
        <Icon />
      </span>
      <span className="admin-um-perm-col-head__title">{title}</span>
    </>
  );

  if (!interactive) {
    return <div className="admin-um-perm-col-head">{content}</div>;
  }

  return (
    <button
      type="button"
      className={cn("admin-um-perm-col-head", "admin-um-perm-col-head--btn", checked && "is-on")}
      aria-label={ariaLabel ?? title}
      title={ariaLabel ?? title}
      disabled={disabled}
      onClick={onToggle}
    >
      {content}
    </button>
  );
}

function PermissionToggle({
  permission,
  label,
  checked,
  readOnly,
  disabled,
  onToggle,
}: {
  permission: RoleMatrixPermission;
  label: string;
  checked: boolean;
  readOnly: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  const Icon = PERM_ICONS[permission];

  if (readOnly) {
    return (
      <span
        className={cn(
          "admin-um-perm-toggle",
          "admin-um-perm-toggle--icon-only",
          `admin-um-perm-toggle--${permission}`,
          checked && "is-on",
          "is-readonly",
        )}
        title={label}
      >
        <span className="admin-um-perm-toggle__icon-wrap">
          <Icon />
        </span>
        <span className="sr-only">{label}</span>
      </span>
    );
  }

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      title={label}
      disabled={disabled}
      className={cn(
        "admin-um-perm-toggle",
        "admin-um-perm-toggle--icon-only",
        `admin-um-perm-toggle--${permission}`,
        checked && "is-on",
      )}
      onClick={onToggle}
    >
      <span className="admin-um-perm-toggle__icon-wrap">
        <Icon />
      </span>
      <span className="sr-only">{label}</span>
    </button>
  );
}

export function PermissionMatrix({
  value,
  disabled = false,
  readOnly = false,
  showBulkControls = true,
  showCoverageSummary = false,
  onChange,
}: PermissionMatrixProps) {
  const t = useTranslations("admin.users.access");
  const [query, setQuery] = useState("");
  const summary = useMemo(() => summarizeRolePermissions(value), [value]);

  const filteredModules = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return ADMIN_ACCESS_MENU_MODULES;
    }

    return ADMIN_ACCESS_MENU_MODULES.filter((module) => {
      const label = t(`menus.${module.id}`).toLowerCase();
      const hint = t(`menusHint.${module.id}`).toLowerCase();
      return label.includes(normalized) || hint.includes(normalized);
    });
  }, [query, t]);

  function updatePermission(
    moduleId: AdminAccessMenuModuleId,
    permission: RoleMatrixPermission,
    enabled: boolean,
  ) {
    onChange?.(applyRoleModulePermission(value, moduleId, permission, enabled));
  }

  const showRowActions = !readOnly;

  return (
    <div className="admin-um-perm">
      {showCoverageSummary ? <PermissionCoverageSummary summary={summary} t={t} /> : null}

      {!readOnly && showBulkControls ? (
        <div className="admin-um-perm__toolbar">
          <AdminFormField
            id="admin-role-perm-search"
            className="admin-um-perm__search"
            label={t("searchModules.label")}
            value={query}
            placeholder={t("searchModules.placeholder")}
            disabled={disabled}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="admin-um-perm__presets">
            <Button
              type="button"
              variant="secondary"
              disabled={disabled}
              onClick={() => onChange?.(getDefaultPageAccess("read"))}
            >
              {t("readOnlyPreset")}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={disabled}
              onClick={() => onChange?.(getDefaultPageAccess("full"))}
            >
              {t("fullPreset")}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={disabled}
              onClick={() => onChange?.(clearAllRolePermissions())}
            >
              {t("clearAll")}
            </Button>
          </div>
        </div>
      ) : null}

      <div className="admin-um-perm-list-wrap">
        <div
          className={cn(
            "admin-um-perm-list",
            showRowActions && "admin-um-perm-list--with-actions",
          )}
          role="table"
          aria-label={t("columns.module")}
        >
          <div className="admin-um-perm-list__row admin-um-perm-list__row--head" role="row">
            <div className="admin-um-perm-list__cell admin-um-perm-list__cell--module" role="columnheader">
              {t("columns.module")}
            </div>
            {ROLE_MATRIX_PERMISSIONS.map((permission) => {
              const label = t(`permissions.${permission}`);
              const columnLabel = t("columnActions.all", { permission: label });
              const allEnabled = isAllModulesPermissionEnabled(value, permission);
              const interactive = !readOnly && showBulkControls;

              return (
                <div
                  key={permission}
                  className="admin-um-perm-list__cell admin-um-perm-list__cell--perm"
                  role="columnheader"
                >
                  <PermissionColumnHead
                    kind={permission}
                    title={label}
                    ariaLabel={interactive ? columnLabel : label}
                    checked={allEnabled}
                    interactive={interactive}
                    disabled={disabled}
                    onToggle={() =>
                      onChange?.(toggleAllModulesForPermission(value, permission))
                    }
                  />
                </div>
              );
            })}
            {showRowActions ? (
              <div
                className="admin-um-perm-list__cell admin-um-perm-list__cell--actions"
                role="columnheader"
              >
                <PermissionColumnHead kind="actions" title={t("rowActions.label")} />
              </div>
            ) : null}
          </div>

          {filteredModules.map((module) => {
            const rowFull = ROLE_MATRIX_PERMISSIONS.every((permission) =>
              isRoleModulePermissionEnabled(value, module.id, permission),
            );
            const rowEmpty = ROLE_MATRIX_PERMISSIONS.every(
              (permission) => !isRoleModulePermissionEnabled(value, module.id, permission),
            );

            return (
              <div
                key={module.id}
                className={cn(
                  "admin-um-perm-list__row",
                  rowFull && "admin-um-perm-list__row--full",
                )}
                role="row"
              >
                <div className="admin-um-perm-list__cell admin-um-perm-list__cell--module" role="cell">
                  <p className="admin-um-perm-list__module-title">{t(`menus.${module.id}`)}</p>
                  <p className="admin-um-perm-list__module-hint">{t(`menusHint.${module.id}`)}</p>
                </div>

                {ROLE_MATRIX_PERMISSIONS.map((permission) => {
                  const checked = isRoleModulePermissionEnabled(value, module.id, permission);
                  const label = `${t(`menus.${module.id}`)} · ${t(`permissions.${permission}`)}`;

                  return (
                    <div
                      key={permission}
                      className="admin-um-perm-list__cell admin-um-perm-list__cell--perm"
                      role="cell"
                    >
                      <PermissionToggle
                        permission={permission}
                        label={label}
                        checked={checked}
                        readOnly={readOnly}
                        disabled={disabled}
                        onToggle={() => updatePermission(module.id, permission, !checked)}
                      />
                    </div>
                  );
                })}

                {showRowActions ? (
                  <div
                    className="admin-um-perm-list__cell admin-um-perm-list__cell--actions"
                    role="cell"
                  >
                    <button
                      type="button"
                      className={cn("admin-um-perm-row-btn", "admin-um-perm-row-btn--enable", rowFull && "is-on")}
                      disabled={disabled}
                      aria-label={`${t("enableModule")} · ${t(`menus.${module.id}`)}`}
                      title={t("enableModule")}
                      onClick={() => onChange?.(enableAllForRoleModule(value, module.id))}
                    >
                      <EnableRowIcon />
                    </button>
                    <button
                      type="button"
                      className={cn(
                        "admin-um-perm-row-btn",
                        "admin-um-perm-row-btn--clear",
                        rowEmpty && "is-muted",
                      )}
                      disabled={disabled || rowEmpty}
                      aria-label={`${t("clearModule")} · ${t(`menus.${module.id}`)}`}
                      title={t("clearModule")}
                      onClick={() => onChange?.(clearRoleModule(value, module.id))}
                    >
                      <ClearRowIcon />
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {filteredModules.length === 0 ? (
        <p className="admin-um-perm__empty">{t("searchModules.empty")}</p>
      ) : null}
    </div>
  );
}
