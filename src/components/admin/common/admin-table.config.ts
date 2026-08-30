import { cn } from "@/lib/utils";
import type { AdminTableColumn } from "./AdminTable";

export type AdminTableColumnVariant =
  | "default"
  | "member"
  | "email"
  | "phone"
  | "designation"
  | "description"
  | "role"
  | "status"
  | "checkbox"
  | "actions";

type AdminTableColumnVariantDefaults = {
  cellClassName?: string;
  headerClassName?: string;
  align?: "left" | "center" | "right";
  stickyEnd?: boolean;
};

export const ADMIN_TABLE_COLUMN_VARIANTS = {
  default: {},
  member: { cellClassName: "admin-table__member-cell" },
  email: { cellClassName: "admin-table__email-cell" },
  phone: { cellClassName: "admin-table__phone-cell" },
  designation: { cellClassName: "admin-table__designation-cell" },
  description: { cellClassName: "admin-table__description-cell" },
  role: { cellClassName: "admin-table__role-cell" },
  status: { cellClassName: "admin-table__status-cell", align: "center" },
  checkbox: { cellClassName: "admin-table__checkbox-cell", align: "center" },
  actions: {
    cellClassName: "admin-table__actions-cell",
    headerClassName: "admin-table__actions-cell",
    align: "center",
    stickyEnd: true,
  },
} as const satisfies Record<AdminTableColumnVariant, AdminTableColumnVariantDefaults>;

export function resolveAdminTableColumn<T>(
  column: AdminTableColumn<T>,
): AdminTableColumn<T> {
  const variant = column.variant ?? "default";
  const defaults: AdminTableColumnVariantDefaults =
    ADMIN_TABLE_COLUMN_VARIANTS[variant] ?? ADMIN_TABLE_COLUMN_VARIANTS.default;

  return {
    ...column,
    align: column.align ?? defaults.align,
    stickyEnd: column.stickyEnd ?? defaults.stickyEnd ?? false,
    cellClassName: cn(defaults.cellClassName, column.cellClassName),
    headerClassName: cn(defaults.headerClassName, column.headerClassName),
  };
}
