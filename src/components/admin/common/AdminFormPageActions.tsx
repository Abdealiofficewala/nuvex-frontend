"use client";

import { Button, ButtonLink } from "@/components/ui/buttons";

type AdminFormPageActionsProps = {
  cancelHref: string;
  cancelLabel: string;
  submitLabel: string;
  savingLabel?: string;
  saving?: boolean;
  submitDisabled?: boolean;
};

export function AdminFormPageActions({
  cancelHref,
  cancelLabel,
  submitLabel,
  savingLabel,
  saving = false,
  submitDisabled = false,
}: AdminFormPageActionsProps) {
  return (
    <div className="admin-page-actions admin-page-actions--form">
      <ButtonLink
        href={cancelHref}
        variant="secondary"
        type="button"
        className="admin-page-actions__btn admin-page-actions__btn--reset"
      >
        {cancelLabel}
      </ButtonLink>
      <Button
        type="submit"
        variant="accent"
        className="admin-page-actions__btn admin-page-actions__btn--save"
        disabled={submitDisabled || saving}
      >
        {saving && savingLabel ? savingLabel : submitLabel}
      </Button>
    </div>
  );
}
