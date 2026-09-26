"use client";

import { AdminTooltip } from "@/components/admin/common/AdminTooltip";
import {
  AdminTableDeleteIcon,
  AdminTableEditIcon,
} from "@/components/admin/common/AdminTableActionIcons";

type AdminInlineTableActionsProps = {
  editLabel: string;
  deleteLabel: string;
  onEdit: () => void;
  onDelete?: () => void;
};

export function AdminInlineTableActions({
  editLabel,
  deleteLabel,
  onEdit,
  onDelete,
}: AdminInlineTableActionsProps) {
  return (
    <div className="admin-table-actions">
      <AdminTooltip label={editLabel} placement="top">
        <button type="button" className="admin-table-actions__btn" aria-label={editLabel} onClick={onEdit}>
          <AdminTableEditIcon />
        </button>
      </AdminTooltip>
      {onDelete ? (
        <AdminTooltip label={deleteLabel} placement="top">
          <button type="button" className="admin-table-actions__btn" aria-label={deleteLabel} onClick={onDelete}>
            <AdminTableDeleteIcon />
          </button>
        </AdminTooltip>
      ) : null}
    </div>
  );
}
