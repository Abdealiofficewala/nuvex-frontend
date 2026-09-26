"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/buttons";
import { cn } from "@/lib/utils";

type AdminListingFilterTriggerProps = {
  activeCount?: number;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
};

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

export function AdminListingFilterTrigger({
  activeCount = 0,
  onClick,
  className,
  disabled = false,
}: AdminListingFilterTriggerProps) {
  const t = useTranslations("admin.common.filters");

  return (
    <Button
      type="button"
      variant="secondary"
      className={cn("admin-page-toolbar__action admin-page-toolbar__action--filter", className)}
      aria-label={t("open")}
      disabled={disabled}
      onClick={onClick}
    >
      <FilterIcon />
      {activeCount > 0 ? t("activeCount", { count: activeCount }) : t("open")}
    </Button>
  );
}
