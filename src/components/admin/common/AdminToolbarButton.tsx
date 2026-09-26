"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Button } from "@/components/ui/buttons";
import { cn } from "@/lib/utils";

type AdminToolbarButtonProps = {
  children: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function AdminToolbarButton({ children, className, ...props }: AdminToolbarButtonProps) {
  return (
    <Button {...props} variant="accent" className={cn("admin-toolbar-btn", className)}>
      {children}
    </Button>
  );
}
