import type { ButtonVariant } from "@/types/ui";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import { buttonClassName } from "../Button/styles";
import "../Button/button.css";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  label: string;
  children: ReactNode;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant = "secondary", label, className, type = "button", children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      className={buttonClassName(variant, { icon: true, className })}
      {...props}
    >
      {children}
    </button>
  );
});
