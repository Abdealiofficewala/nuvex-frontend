import { cn } from "@/lib/utils";

type AdminFieldErrorProps = {
  id?: string;
  message?: string | null;
  reserveSpace?: boolean;
};

export function AdminFieldError({
  id,
  message,
  reserveSpace = true,
}: AdminFieldErrorProps) {
  const hasMessage = Boolean(message?.trim());

  if (!hasMessage && !reserveSpace) {
    return null;
  }

  return (
    <p
      id={id}
      className={cn("admin-contact-form__error", "admin-field-error", !hasMessage && "is-empty")}
      role={hasMessage ? "alert" : undefined}
      aria-hidden={!hasMessage || undefined}
    >
      {hasMessage ? message : "\u00a0"}
    </p>
  );
}
