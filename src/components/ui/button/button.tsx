import type { ButtonVariant } from "@/types/ui";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import { buttonClassName } from "./class-names";
import "../ui.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", className, type = "button", children, ...props },
  ref,
) {
  return (
    <button ref={ref} type={type} className={buttonClassName(variant, { className })} {...props}>
      {children}
    </button>
  );
});
