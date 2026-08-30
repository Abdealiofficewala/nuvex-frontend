import { Link } from "@/i18n/routing";
import type { ButtonVariant } from "@/types/ui";
import type { ComponentProps, ReactNode } from "react";
import { buttonClassName } from "./class-names";
import "../ui.css";

type ButtonLinkProps = {
  href: string;
  variant?: ButtonVariant;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

export function ButtonLink({
  href,
  variant = "primary",
  arrow = false,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={buttonClassName(variant, { arrow, className })}
      {...props}
    >
      {children}
    </Link>
  );
}
