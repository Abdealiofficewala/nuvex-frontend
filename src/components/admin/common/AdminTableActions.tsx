"use client";

import { AdminTooltip } from "@/components/admin/common/AdminTooltip";
import {
  AdminTableDeleteIcon,
  AdminTableEditIcon,
  AdminTableViewIcon,
} from "@/components/admin/common/AdminTableActionIcons";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type AdminTableActionsProps = {
  viewHref?: string;
  editHref?: string;
  viewLabel: string;
  editLabel: string;
  deleteLabel: string;
  onDelete?: () => void;
  deleteDisabled?: boolean;
  className?: string;
};

export function AdminTableActions({
  viewHref,
  editHref,
  viewLabel,
  editLabel,
  deleteLabel,
  onDelete,
  deleteDisabled = false,
  className,
}: AdminTableActionsProps) {
  return (
    <div className={cn("admin-table-actions", className)}>
      {viewHref ? (
        <AdminTooltip label={viewLabel} placement="top">
          <Link
            href={viewHref}
            className="admin-table-actions__btn"
            aria-label={viewLabel}
          >
            <AdminTableViewIcon />
          </Link>
        </AdminTooltip>
      ) : null}
      {editHref ? (
        <AdminTooltip label={editLabel} placement="top">
          <Link
            href={editHref}
            className="admin-table-actions__btn"
            aria-label={editLabel}
          >
            <AdminTableEditIcon />
          </Link>
        </AdminTooltip>
      ) : null}
      {onDelete ? (
        <AdminTooltip label={deleteLabel} placement="top">
          <button
            type="button"
            className="admin-table-actions__btn"
            aria-label={deleteLabel}
            disabled={deleteDisabled}
            onClick={onDelete}
          >
            <AdminTableDeleteIcon />
          </button>
        </AdminTooltip>
      ) : null}
    </div>
  );
}
