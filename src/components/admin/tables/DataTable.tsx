import { getTranslations } from "next-intl/server";
import { AdminTable, type AdminTableColumn } from "@/components/admin/common/AdminTable";

type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => string;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
};

export async function DataTable<T>({ columns, rows }: DataTableProps<T>) {
  const t = await getTranslations("admin.tables");

  const tableColumns: AdminTableColumn<T>[] = columns.map((column) => ({
    key: column.key,
    header: column.header,
    render: (row) => column.render(row),
  }));

  return (
    <AdminTable
      columns={tableColumns}
      rows={rows}
      rowKey={(_, index) => String(index)}
      emptyTitle={t("empty")}
    />
  );
}
