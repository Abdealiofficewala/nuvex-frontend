import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export { shouldShowFieldErrorMessage as shouldShowFieldError } from "@/lib/validations/common";

type AdminFieldLabelProps = {
  children: ReactNode;
  required?: boolean;
  className?: string;
  htmlFor?: string;
};

export function AdminFieldLabel({
  children,
  required = false,
  className,
  htmlFor,
}: AdminFieldLabelProps) {
  const content = (
    <>
      {children}
      {required ? (
        <span className="admin-field-label__required" aria-hidden="true">
          *
        </span>
      ) : null}
    </>
  );

  if (htmlFor) {
    return (
      <label htmlFor={htmlFor} className={cn("admin-field-label", className)}>
        {content}
      </label>
    );
  }

  return <span className={cn("admin-field-label", className)}>{content}</span>;
}
