"use client";

import { Button } from "@/components/ui/buttons";
import { cn } from "@/lib/utils";

type AdminListingFilterModalFooterProps = {
  resetLabel: string;
  cancelLabel: string;
  applyLabel: string;
  resetDisabled?: boolean;
  onReset: () => void;
  onCancel: () => void;
  onApply: () => void;
};

export function AdminListingFilterModalFooter({
  resetLabel,
  cancelLabel,
  applyLabel,
  resetDisabled = false,
  onReset,
  onCancel,
  onApply,
}: AdminListingFilterModalFooterProps) {
  return (
    <div className="admin-listing-filter-modal__footer">
      <Button
        type="button"
        variant="ghost"
        className={cn("admin-modal__btn", "admin-listing-filter-modal__btn-reset")}
        disabled={resetDisabled}
        onClick={onReset}
      >
        {resetLabel}
      </Button>
      <div className="admin-listing-filter-modal__footer-actions">
        <Button
          type="button"
          variant="secondary"
          className={cn("admin-modal__btn", "admin-modal__btn--cancel")}
          onClick={onCancel}
        >
          {cancelLabel}
        </Button>
        <Button
          type="button"
          variant="accent"
          className={cn("admin-modal__btn", "admin-modal__btn--confirm")}
          onClick={onApply}
        >
          {applyLabel}
        </Button>
      </div>
    </div>
  );
}
