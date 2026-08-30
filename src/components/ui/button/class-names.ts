import { cn } from "@/lib/utils";
import type { ButtonVariant } from "@/types/ui";

type ButtonClassOptions = {
  arrow?: boolean;
  className?: string;
};

export function buttonClassName(
  variant: ButtonVariant = "primary",
  { arrow = false, className }: ButtonClassOptions = {},
) {
  return cn("ui-button", `ui-button--${variant}`, arrow && "ui-button--arrow", className);
}
