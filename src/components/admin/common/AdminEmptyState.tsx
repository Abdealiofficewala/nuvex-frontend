"use client";

import { useTranslations } from "next-intl";
import { AdminEmptyStateVisual } from "@/components/admin/common/AdminEmptyStateVisual";
import { cn } from "@/lib/utils";

type AdminEmptyStateProps = {
  /** Override default shared copy — use only for not-found style states. */
  title?: string;
  description?: string;
  className?: string;
};

export function AdminEmptyState({ title, description, className }: AdminEmptyStateProps) {
  const t = useTranslations("admin.common.empty");

  return (
    <div className={cn("admin-empty-state", className)}>
      <div className="admin-empty-state__frame" aria-hidden="true">
        <AdminEmptyStateVisual />
      </div>

      <div className="admin-empty-state__copy">
        <h3 className="admin-empty-state__title">{title ?? t("title")}</h3>
        <p className="admin-empty-state__body">{description ?? t("body")}</p>
      </div>
    </div>
  );
}
