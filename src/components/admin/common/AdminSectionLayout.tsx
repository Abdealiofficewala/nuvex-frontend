import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AdminSectionLayoutProps = {
  sidebar: ReactNode;
  children: ReactNode;
  className?: string;
};

export function AdminSectionLayout({ sidebar, children, className }: AdminSectionLayoutProps) {
  return (
    <div className={cn("admin-section-layout", className)}>
      {sidebar}
      <div className="admin-section-layout__content">{children}</div>
    </div>
  );
}
