import { cn } from "@/lib/utils";
import type { ButtonVariant } from "@/types/ui";

type ButtonClassOptions = {
  arrow?: boolean;
  className?: string;
  icon?: boolean;
};

export function buttonClassName(
  variant: ButtonVariant = "primary",
  { arrow = false, icon = false, className }: ButtonClassOptions = {},
) {
  return cn(
    "ui-button",
    `ui-button--${variant}`,
    arrow && "ui-button--arrow",
    icon && "ui-button--icon",
    className,
  );
}
