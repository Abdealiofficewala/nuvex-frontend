import type { ReactNode } from "react";
import {
  resolveAdminTableColumn,
  type AdminTableColumnVariant,
} from "@/components/admin/common/admin-table.config";
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

export type AdminTableProps<T> = {
  columns: AdminTableColumn<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => string;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  tableClassName?: string;
  caption?: string;
};

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
  emptyTitle,
  emptyDescription,
  className,
  tableClassName,
  caption,
}: AdminTableProps<T>) {
  const resolvedColumns = columns.map(resolveAdminTableColumn);

  if (!rows.length) {
    return (
      <div className={cn("admin-table-root", className)}>
        <div className="admin-table-panel admin-table-panel--empty">
          <div className="admin-table-empty">
            <span className="admin-table-empty__icon" aria-hidden="true" />
            {emptyTitle ? <h3 className="admin-table-empty__title">{emptyTitle}</h3> : null}
            {emptyDescription ? <p className="admin-table-empty__body">{emptyDescription}</p> : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("admin-table-root", className)}>
      <div className="admin-table-panel admin-table-panel--scroll" tabIndex={0}>
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
            {rows.map((row, index) => (
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
    </div>
  );
}
