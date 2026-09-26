"use client";

import type { ReactNode } from "react";
import { AdminEmptyState } from "@/components/admin/common/AdminEmptyState";
import { AdminTablePagination } from "@/components/admin/common/AdminTablePagination";
import {
  resolveAdminTableColumn,
  type AdminTableColumnVariant,
} from "@/components/admin/common/admin-table.config";
import { ADMIN_TABLE_DEFAULT_PAGE_SIZE, ADMIN_TABLE_PAGE_SIZE_OPTIONS } from "@/lib/admin/admin-pagination";
import { useAdminPagination } from "@/lib/admin/use-admin-pagination";
import { cn } from "@/lib/utils";

export type AdminTableColumn<T> = {
  key: string;
  header: ReactNode;
  variant?: AdminTableColumnVariant;
  headerClassName?: string;
  cellClassName?: string;
  align?: "left" | "center" | "right";
  stickyEnd?: boolean;
  render: (row: T, index: number) => ReactNode;
};

export type AdminTablePaginationConfig = {
  enabled?: boolean;
  pageSize?: number;
  pageSizeOptions?: readonly number[];
};

export type AdminTableProps<T> = {
  columns: AdminTableColumn<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => string;
  loading?: boolean;
  toolbarMeta?: ReactNode;
  toolbarAction?: ReactNode;
  className?: string;
  tableClassName?: string;
  caption?: string;
  pagination?: boolean | AdminTablePaginationConfig;
};

function AdminTableToolbar({
  meta,
  action,
}: {
  meta?: ReactNode;
  action?: ReactNode;
}) {
  if (!meta && !action) {
    return null;
  }

  return (
    <div className="admin-table-panel__toolbar">
      {meta ? <div className="admin-table-panel__toolbar-start">{meta}</div> : null}
      {action ? <div className="admin-table-panel__toolbar-end">{action}</div> : null}
    </div>
  );
}

function getHeaderClassName<T>(column: AdminTableColumn<T>) {
  return cn(
    column.stickyEnd && column.cellClassName,
    column.headerClassName,
    column.stickyEnd && "admin-table__sticky-end",
    column.align === "center" && "is-center",
    column.align === "right" && "is-right",
  );
}

function getCellClassName<T>(column: AdminTableColumn<T>) {
  return cn(
    column.cellClassName,
    column.stickyEnd && "admin-table__sticky-end",
    column.align === "center" && "is-center",
    column.align === "right" && "is-right",
  );
}

export function AdminTable<T>({
  columns,
  rows,
  rowKey,
  loading = false,
  toolbarMeta,
  toolbarAction,
  className,
  tableClassName,
  caption,
  pagination = true,
}: AdminTableProps<T>) {
  const resolvedColumns = columns.map(resolveAdminTableColumn);
  const paginationConfig =
    pagination === false
      ? { enabled: false as const }
      : {
          enabled: true as const,
          pageSize:
            typeof pagination === "object" ? pagination.pageSize : ADMIN_TABLE_DEFAULT_PAGE_SIZE,
          pageSizeOptions:
            typeof pagination === "object" && pagination.pageSizeOptions
              ? pagination.pageSizeOptions
              : ADMIN_TABLE_PAGE_SIZE_OPTIONS,
        };
  const {
    rows: paginatedRows,
    page,
    pageSize,
    totalCount,
    totalPages,
    rangeStart,
    rangeEnd,
    pageSizeOptions,
    enabled: paginationEnabled,
    setPage,
    setPageSize,
  } = useAdminPagination(rows, paginationConfig);
  const displayRows = paginationEnabled ? paginatedRows : rows;
  const toolbar = <AdminTableToolbar meta={toolbarMeta} action={toolbarAction} />;
  const paginationFooter =
    paginationEnabled && totalCount > 0 ? (
      <AdminTablePagination
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        totalPages={totalPages}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        pageSizeOptions={pageSizeOptions}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    ) : null;

  if (loading) {
    return (
      <div className={cn("admin-table-root", className)}>
        <div className="admin-table-panel admin-table-panel--empty">
          {toolbar}
          <div className="admin-table-loading" aria-busy="true" aria-live="polite">
            <span className="admin-table-loading__spinner" aria-hidden="true" />
          </div>
        </div>
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className={cn("admin-table-root", className)}>
        <div className="admin-table-panel admin-table-panel--empty">
          {toolbar}
          <AdminEmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("admin-table-root", className)}>
      <div className="admin-table-panel">
        {toolbar}
        <div className="admin-table-panel__scroll" tabIndex={0}>
          <table className={cn("admin-table admin-table--scrollable", tableClassName)}>
            {caption ? <caption className="sr-only">{caption}</caption> : null}
            <thead>
              <tr>
                {resolvedColumns.map((column) => (
                  <th key={column.key} className={getHeaderClassName(column)} scope="col">
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayRows.map((row, index) => (
                <tr key={rowKey(row, index)}>
                  {resolvedColumns.map((column) => (
                    <td key={column.key} className={getCellClassName(column)}>
                      {column.render(row, index)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {paginationFooter}
      </div>
    </div>
  );
}
