"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  AdminConfirmModal,
  AdminFormField,
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
import {
  ADMIN_USERS_UPDATED_EVENT,
  deleteAdminUser,
  getAdminUserFullName,
  getAdminUserPhone,
  getAdminUserRoleLabel,
  getAdminUsers,
  type AdminUserRecord,
} from "@/lib/admin-users";
import { getAdminRoles } from "@/lib/admin-roles";
import {
  ROUTES,
  adminUserEditHref,
  adminUserViewHref,
} from "@/lib/constants";
import { cn, hasValue, initials } from "@/lib/utils";

type SortKey = "name" | "email" | "createdAt" | "role";

type UserFilters = {
  roleId: string;
  active: "" | "active" | "inactive";
  createdFrom: string;
  createdTo: string;
  sort: SortKey;
};

const EMPTY_FILTERS: UserFilters = {
  roleId: "",
  active: "",
  createdFrom: "",
  createdTo: "",
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

export function UserListing() {
  const t = useTranslations("admin.users.listing");
  const tFilters = useTranslations("admin.common.filters");
  const toast = useToast();
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [roles, setRoles] = useState(getAdminRoles());
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<UserFilters>(EMPTY_FILTERS);
  const [draftFilters, setDraftFilters] = useState<UserFilters>(EMPTY_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminUserRecord | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const sync = () => {
      setUsers(getAdminUsers());
      setRoles(getAdminRoles());
    };
    sync();
    window.addEventListener(ADMIN_USERS_UPDATED_EVENT, sync);
    return () => window.removeEventListener(ADMIN_USERS_UPDATED_EVENT, sync);
  }, []);

  useEffect(() => {
    if (filterOpen) {
      setDraftFilters(filters);
    }
  }, [filterOpen, filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.roleId) {
      count += 1;
    }
    if (filters.active) {
      count += 1;
    }
    if (filters.createdFrom) {
      count += 1;
    }
    if (filters.createdTo) {
      count += 1;
    }
    return count;
  }, [filters]);

  const stats = useMemo(() => {
    const activeCount = users.filter((user) => user.active).length;
    return {
      total: users.length,
      active: activeCount,
      inactive: users.length - activeCount,
      roles: new Set(users.map((user) => user.roleId).filter(Boolean)).size,
    };
  }, [users]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    let rows = users.filter((user) => {
      if (filters.roleId && user.roleId !== filters.roleId) {
        return false;
      }

      if (filters.active === "active" && !user.active) {
        return false;
      }

      if (filters.active === "inactive" && user.active) {
        return false;
      }

      if (filters.createdFrom) {
        const from = new Date(filters.createdFrom).getTime();
        if (!Number.isNaN(from) && new Date(user.createdAt).getTime() < from) {
          return false;
        }
      }

      if (filters.createdTo) {
        const to = new Date(filters.createdTo).getTime();
        if (!Number.isNaN(to) && new Date(user.createdAt).getTime() > to + 86_400_000) {
          return false;
        }
      }

      if (!query) {
        return true;
      }

      const haystack = [
        getAdminUserFullName(user),
        user.email,
        user.username,
        getAdminUserRoleLabel(user),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });

    rows = [...rows].sort((left, right) => {
      if (filters.sort === "email") {
        return left.email.localeCompare(right.email);
      }

      if (filters.sort === "createdAt") {
        return right.createdAt.localeCompare(left.createdAt);
      }

      if (filters.sort === "role") {
        return getAdminUserRoleLabel(left).localeCompare(getAdminUserRoleLabel(right));
      }

      return getAdminUserFullName(left).localeCompare(getAdminUserFullName(right));
    });

    return rows;
  }, [filters, search, users]);

  async function handleDeleteConfirm() {
    if (!deleteTarget) {
      return;
    }

    setDeleteLoading(true);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 280));
      deleteAdminUser(deleteTarget.id);
      toast.success(t("delete.success.title"), t("delete.success.body"));
      setDeleteTarget(null);
    } catch {
      toast.error(t("delete.errors.title"), t("delete.errors.generic"));
    } finally {
      setDeleteLoading(false);
    }
  }

  const columns = useMemo<AdminTableColumn<AdminUserRecord>[]>(
    () => [
      {
        key: "name",
        header: t("table.name"),
        variant: "member",
        render: (row) => {
          const name = getAdminUserFullName(row);

          return (
            <div className="admin-table-member">
              <span className="admin-table-member__avatar" aria-hidden="true">
                {hasValue(row.image) ? (
                  row.image.startsWith("data:") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={row.image} alt="" className="admin-table-member__native-image" />
                  ) : (
                    <Image src={row.image} alt="" fill sizes="40px" />
                  )
                ) : (
                  <span className="admin-table-member__initials">{initials(name || row.email)}</span>
                )}
              </span>
              <AdminTooltip label={name || row.email} className="admin-tooltip-trigger--fit">
                <strong className="admin-table__label admin-table__cell-text">{name || row.email}</strong>
              </AdminTooltip>
            </div>
          );
        },
      },
      {
        key: "email",
        header: t("table.email"),
        variant: "email",
        render: (row) => (
          <AdminTooltip label={row.email} className="admin-tooltip-trigger--fit">
            <span className="admin-table__label admin-table__cell-text">{row.email}</span>
          </AdminTooltip>
        ),
      },
      {
        key: "phone",
        header: t("table.phone"),
        variant: "phone",
        render: (row) => {
          const phone = getAdminUserPhone(row);

          return phone ? (
            <AdminTooltip label={phone} className="admin-tooltip-trigger--fit">
              <span className="admin-table__label admin-table__cell-text">{phone}</span>
            </AdminTooltip>
          ) : (
            <span className="admin-table__muted">—</span>
          );
        },
      },
      {
        key: "role",
        header: t("table.role"),
        variant: "role",
        render: (row) => {
          const roleLabel = getAdminUserRoleLabel(row);

          return (
            <AdminTooltip label={roleLabel} className="admin-tooltip-trigger--fit">
              <span className={cn("admin-table-role", `admin-table-role--${row.role}`)}>
                <span className="admin-table-role__dot" aria-hidden="true" />
                <span className="admin-table-role__text">{roleLabel}</span>
              </span>
            </AdminTooltip>
          );
        },
      },
      {
        key: "active",
        header: t("table.active"),
        variant: "status",
        render: (row) => (
          <AdminStatusBadge
            active={row.active}
            activeLabel={t("status.active")}
            inactiveLabel={t("status.inactive")}
          />
        ),
      },
      {
        key: "actions",
        header: t("table.actions"),
        variant: "actions",
        render: (row) => (
          <AdminTableActions
            viewHref={adminUserViewHref(row.id)}
            editHref={adminUserEditHref(row.id)}
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

  const roleOptions = roles.map((role) => ({ label: role.name, value: role.id }));

  const activePercent =
    stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0;

  return (
    <section className="admin-um-users-listing admin-um-listing">
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
          label={t("stats.roles")}
          value={stats.roles}
          meta={t("statsMeta.rolesHint")}
        />
      </AdminUmStatsGrid>

      <div className="admin-um-toolbar admin-um-toolbar--users">
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
        createHref={ROUTES.admin.users.create}
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
              setDraftFilters(EMPTY_FILTERS);
              setFilters(EMPTY_FILTERS);
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
            id="admin-users-filter-role"
            label={t("filters.role")}
            value={draftFilters.roleId}
            placeholder={t("filters.anyRole")}
            options={roleOptions}
            onChange={(value) => setDraftFilters((current) => ({ ...current, roleId: value }))}
          />
          <AdminFormSelect
            id="admin-users-filter-status"
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
                active: value as UserFilters["active"],
              }))
            }
          />
          <AdminFormField
            id="admin-users-filter-from"
            label={t("filters.createdFrom")}
            type="date"
            value={draftFilters.createdFrom}
            onChange={(event) =>
              setDraftFilters((current) => ({ ...current, createdFrom: event.target.value }))
            }
          />
          <AdminFormField
            id="admin-users-filter-to"
            label={t("filters.createdTo")}
            type="date"
            value={draftFilters.createdTo}
            onChange={(event) =>
              setDraftFilters((current) => ({ ...current, createdTo: event.target.value }))
            }
          />
          <AdminFormSelect
            id="admin-users-filter-sort"
            label={t("sort.label")}
            value={draftFilters.sort}
            options={[
              { label: t("sort.name"), value: "name" },
              { label: t("sort.email"), value: "email" },
              { label: t("sort.role"), value: "role" },
              { label: t("sort.createdAt"), value: "createdAt" },
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
        description={t("delete.confirm.description", {
          name: deleteTarget ? getAdminUserFullName(deleteTarget) : "",
        })}
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
