"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  AdminConfirmModal,
  AdminFormSelect,
  AdminListingFilterModalFooter,
  AdminListingTable,
  AdminModal,
  AdminStatusBadge,
  AdminUmStatCard,
  AdminUmStatsGrid,
} from "@/components/admin/common";
import type { AdminTableColumn } from "@/components/admin/common/AdminTable";
import { AdminTableActions } from "@/components/admin/common/AdminTableActions";
import { AdminTooltip } from "@/components/admin/common/AdminTooltip";
import { useToast } from "@/components/ui/toast";
import { summarizeRolePermissions } from "@/lib/admin-role-permissions";
import {
  ADMIN_ROLES_UPDATED_EVENT,
  DEFAULT_ADMIN_ROLE_IDS,
  deleteAdminRole,
  getAdminRoles,
  type AdminRoleRecord,
} from "@/lib/admin-roles";
import { ADMIN_USERS_UPDATED_EVENT, countAdminUsersWithRole } from "@/lib/admin-users";
import {
  ROUTES,
  adminRoleEditHref,
  adminRoleViewHref,
} from "@/lib/constants";
import { capitalizeFieldText, cn } from "@/lib/utils";

type SortKey = "name" | "users" | "coverage" | "updatedAt";

const PROTECTED_ROLE_IDS = new Set<string>(Object.values(DEFAULT_ADMIN_ROLE_IDS));

type RoleFilters = {
  active: "" | "active" | "inactive";
  sort: SortKey;
};

const EMPTY_ROLE_FILTERS: RoleFilters = {
  active: "",
  sort: "name",
};

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6h16M7 12h10M10 18h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function RoleListing() {
  const t = useTranslations("admin.users.roles.listing");
  const tFilters = useTranslations("admin.common.filters");
  const toast = useToast();
  const [roles, setRoles] = useState<AdminRoleRecord[]>([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<RoleFilters>(EMPTY_ROLE_FILTERS);
  const [draftFilters, setDraftFilters] = useState<RoleFilters>(EMPTY_ROLE_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminRoleRecord | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const sync = () => setRoles(getAdminRoles());
    sync();
    window.addEventListener(ADMIN_ROLES_UPDATED_EVENT, sync);
    window.addEventListener(ADMIN_USERS_UPDATED_EVENT, sync);
    return () => {
      window.removeEventListener(ADMIN_ROLES_UPDATED_EVENT, sync);
      window.removeEventListener(ADMIN_USERS_UPDATED_EVENT, sync);
    };
  }, []);

  useEffect(() => {
    if (filterOpen) {
      setDraftFilters(filters);
    }
  }, [filterOpen, filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.active) {
      count += 1;
    }
    if (filters.sort !== EMPTY_ROLE_FILTERS.sort) {
      count += 1;
    }
    return count;
  }, [filters]);

  const stats = useMemo(() => {
    const active = roles.filter((role) => role.active).length;
    const assigned = roles.reduce((total, role) => total + countAdminUsersWithRole(role.id), 0);
    return {
      total: roles.length,
      active,
      inactive: roles.length - active,
      assigned,
    };
  }, [roles]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    let rows = roles.filter((role) => {
      if (filters.active === "active" && !role.active) {
        return false;
      }

      if (filters.active === "inactive" && role.active) {
        return false;
      }

      if (!query) {
        return true;
      }

      const haystack = `${role.name} ${role.description}`.toLowerCase();
      return haystack.includes(query);
    });

    rows = [...rows].sort((left, right) => {
      if (filters.sort === "name") {
        return left.name.localeCompare(right.name);
      }

      if (filters.sort === "users") {
        return countAdminUsersWithRole(right.id) - countAdminUsersWithRole(left.id);
      }

      if (filters.sort === "coverage") {
        const leftCoverage = summarizeRolePermissions(left.permissions).modulesWithView;
        const rightCoverage = summarizeRolePermissions(right.permissions).modulesWithView;
        return rightCoverage - leftCoverage;
      }

      return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
    });

    return rows;
  }, [roles, search, filters]);

  function requestDelete(role: AdminRoleRecord) {
    if (PROTECTED_ROLE_IDS.has(role.id)) {
      toast.error(t("delete.errors.title"), t("delete.errors.protected"));
      return;
    }

    if (countAdminUsersWithRole(role.id) > 0) {
      toast.error(t("delete.errors.title"), t("delete.errors.inUse"));
      return;
    }

    setDeleteTarget(role);
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) {
      return;
    }

    setDeleteLoading(true);
    try {
      deleteAdminRole(deleteTarget.id);
      toast.success(t("delete.success.title"), t("delete.success.body"));
      setDeleteTarget(null);
    } catch {
      toast.error(t("delete.errors.title"), t("delete.errors.generic"));
    } finally {
      setDeleteLoading(false);
    }
  }

  const columns = useMemo<AdminTableColumn<AdminRoleRecord>[]>(
    () => [
      {
        key: "name",
        header: t("table.name"),
        render: (row) => (
          <AdminTooltip label={row.name} className="admin-tooltip-trigger--fit">
            <strong className="admin-table__label admin-table__cell-text">
              {capitalizeFieldText(row.name)}
            </strong>
          </AdminTooltip>
        ),
      },
      {
        key: "description",
        header: t("table.description"),
        render: (row) => (
          <span className="admin-table__cell-text">
            {row.description ? capitalizeFieldText(row.description) : "—"}
          </span>
        ),
      },
      {
        key: "coverage",
        header: t("table.coverage"),
        render: (row) => {
          const summary = summarizeRolePermissions(row.permissions);
          const percent =
            summary.moduleTotal > 0
              ? Math.round((summary.modulesWithView / summary.moduleTotal) * 100)
              : 0;

          return (
            <div className="admin-um-role-coverage">
              <div className="admin-um-role-coverage__bar" aria-hidden="true">
                <span style={{ width: `${percent}%` }} />
              </div>
              <span className="admin-um-role-coverage__label">
                {t("coverageLabel", {
                  enabled: summary.modulesWithView,
                  total: summary.moduleTotal,
                })}
              </span>
            </div>
          );
        },
      },
      {
        key: "users",
        header: t("table.users"),
        render: (row) => {
          const count = countAdminUsersWithRole(row.id);
          return (
            <span className={cn("admin-um-role-users", count > 0 && "has-users")}>
              {count}
            </span>
          );
        },
      },
      {
        key: "active",
        header: t("table.status"),
        render: (row) => (
          <AdminStatusBadge active={row.active} activeLabel={t("status.active")} inactiveLabel={t("status.inactive")} />
        ),
      },
      {
        key: "actions",
        header: t("table.actions"),
        variant: "actions",
        render: (row) => (
          <AdminTableActions
            viewHref={adminRoleViewHref(row.id)}
            editHref={adminRoleEditHref(row.id)}
            viewLabel={t("actions.view")}
            editLabel={t("actions.edit")}
            deleteLabel={t("actions.delete")}
            onDelete={() => requestDelete(row)}
          />
        ),
      },
    ],
    [t],
  );

  const activePercent =
    stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0;

  return (
    <section className="admin-um-roles-listing admin-um-listing">
      <AdminUmStatsGrid>
        <AdminUmStatCard
          tone="total"
          label={t("stats.total")}
          value={stats.total}
          meta={t("statsMeta.catalogue")}
        />
        <AdminUmStatCard
          tone="active"
          label={t("stats.active")}
          value={stats.active}
          meta={t("statsMeta.activeRate", { percent: activePercent })}
        />
        <AdminUmStatCard
          tone="inactive"
          label={t("stats.inactive")}
          value={stats.inactive}
          meta={
            stats.inactive > 0
              ? t("statsMeta.inactiveHint")
              : t("statsMeta.inactiveClear")
          }
        />
        <AdminUmStatCard
          tone="assigned"
          label={t("stats.assigned")}
          value={stats.assigned}
          meta={t("statsMeta.assignedHint")}
        />
      </AdminUmStatsGrid>

      <div className="admin-um-toolbar admin-um-toolbar--roles">
        <div className="admin-um-toolbar__row">
          <label className="admin-um-toolbar__search">
            <span className="admin-um-toolbar__search-icon">
              <SearchIcon />
            </span>
            <span className="sr-only">{t("search.label")}</span>
            <input
              type="search"
              className="admin-um-toolbar__search-input"
              value={search}
              placeholder={t("search.placeholder")}
              onChange={(event) => setSearch(event.target.value)}
            />
            {search.trim() ? (
              <button
                type="button"
                className="admin-um-toolbar__search-clear"
                onClick={() => setSearch("")}
              >
                {t("search.clear")}
              </button>
            ) : null}
          </label>

          <button
            type="button"
            className={cn("admin-um-toolbar__filter", activeFilterCount > 0 && "is-active")}
            aria-label={t("filters.open")}
            onClick={() => setFilterOpen(true)}
          >
            <FilterIcon />
            {activeFilterCount > 0 ? (
              <span className="admin-um-toolbar__filter-badge">{activeFilterCount}</span>
            ) : null}
          </button>
        </div>
      </div>

      <AdminListingTable
        columns={columns}
        rows={filteredRows}
        rowKey={(row) => row.id}
        toolbarTitle={t("toolbarTitle")}
        createHref={ROUTES.admin.users.rolesCreate}
        createLabel={t("addAction")}
      />

      <AdminModal
        open={filterOpen}
        title={t("filters.title")}
        icon="filter"
        simple
        dialogClassName="is-filters"
        size="wide"
        onClose={() => setFilterOpen(false)}
        footer={
          <AdminListingFilterModalFooter
            resetLabel={t("filters.reset")}
            cancelLabel={tFilters("cancel")}
            applyLabel={t("filters.apply")}
            resetDisabled={activeFilterCount === 0}
            onReset={() => {
              setDraftFilters(EMPTY_ROLE_FILTERS);
              setFilters(EMPTY_ROLE_FILTERS);
              setFilterOpen(false);
            }}
            onCancel={() => setFilterOpen(false)}
            onApply={() => {
              setFilters(draftFilters);
              setFilterOpen(false);
            }}
          />
        }
      >
        <div className="admin-form-grid admin-form-grid--2 admin-listing-filter-modal__fields">
          <AdminFormSelect
            id="admin-roles-filter-status"
            label={t("filters.status")}
            value={draftFilters.active}
            placeholder={t("filters.anyStatus")}
            options={[
              { label: t("status.active"), value: "active" },
              { label: t("status.inactive"), value: "inactive" },
            ]}
            onChange={(value) =>
              setDraftFilters((current) => ({
                ...current,
                active: value as RoleFilters["active"],
              }))
            }
          />
          <AdminFormSelect
            id="admin-roles-filter-sort"
            label={t("sort.label")}
            value={draftFilters.sort}
            options={[
              { label: t("sort.name"), value: "name" },
              { label: t("sort.users"), value: "users" },
              { label: t("sort.coverage"), value: "coverage" },
              { label: t("sort.updatedAt"), value: "updatedAt" },
            ]}
            onChange={(value) =>
              setDraftFilters((current) => ({
                ...current,
                sort: value as SortKey,
              }))
            }
          />
        </div>
      </AdminModal>

      <AdminConfirmModal
        open={Boolean(deleteTarget)}
        title={t("delete.confirm.title")}
        description={t("delete.confirm.description", { name: deleteTarget?.name ?? "" })}
        confirmLabel={t("delete.confirm.confirm")}
        tone="caution"
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
