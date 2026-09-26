"use client";

import { AdminTable, type AdminTableColumn, type AdminTableProps } from "@/components/admin/common/AdminTable";

type AdminReferenceTableProps<T> = Pick<
  AdminTableProps<T>,
  "columns" | "rows" | "rowKey" | "loading" | "caption" | "className"
> & {
  title: string;
  description?: string;
};

export function AdminReferenceTable<T>({
  title,
  description,
  ...tableProps
}: AdminReferenceTableProps<T>) {
  return (
    <AdminTable
      {...tableProps}
      toolbarMeta={
        <div className="admin-reference-table__meta">
          <p className="admin-reference-table__title">{title}</p>
          {description ? <p className="admin-field-hint">{description}</p> : null}
        </div>
      }
    />
  );
}

export type { AdminTableColumn };
