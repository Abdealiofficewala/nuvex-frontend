"use client";

import type { ReactNode } from "react";
import { AdminTable, type AdminTableProps } from "@/components/admin/common/AdminTable";
import { ButtonLink } from "@/components/ui/buttons";

function AdminPlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function formatListingToolbarMeta({
  loading = false,
  count,
  title,
}: {
  loading?: boolean;
  count: number;
  title: string;
}) {
  if (!loading && count > 0) {
    return `${title} (${count})`;
  }

  return title;
}

/** @deprecated Use formatListingToolbarMeta */
export const resolveListingToolbarMeta = formatListingToolbarMeta;

type AdminListingTableProps<T> = Omit<AdminTableProps<T>, "toolbarMeta" | "toolbarAction"> & {
  toolbarTitle: string;
  createHref: string;
  createLabel: string;
  toolbarAction?: ReactNode;
};

export function AdminListingTable<T>({
  rows,
  loading = false,
  toolbarTitle,
  createHref,
  createLabel,
  toolbarAction,
  ...tableProps
}: AdminListingTableProps<T>) {
  const toolbarMeta = formatListingToolbarMeta({
    loading,
    count: rows.length,
    title: toolbarTitle,
  });

  return (
    <AdminTable
      {...tableProps}
      rows={rows}
      loading={loading}
      toolbarMeta={<p className="admin-page-toolbar__meta">{toolbarMeta}</p>}
      toolbarAction={
        toolbarAction ?? (
          <ButtonLink href={createHref} variant="accent" className="admin-page-toolbar__action">
            <AdminPlusIcon />
            {createLabel}
          </ButtonLink>
        )
      }
    />
  );
}
