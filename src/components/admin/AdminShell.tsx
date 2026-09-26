"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PanelToggleIcon } from "@/components/admin/header/AdminMenuIcons";
import { cn } from "@/lib/utils";
import { ActiveThemeProvider } from "@/components/admin/appearance/ActiveThemeProvider";
import { Header } from "@/components/admin/header/Header";
import { Sidebar } from "@/components/admin/sidebar/Sidebar";

type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const t = useTranslations("admin.nav");
  const [expanded, setExpanded] = useState(false);

  const toggle = () => setExpanded((current) => !current);
  const collapse = () => setExpanded(false);

  return (
    <ActiveThemeProvider>
    <div className={cn("admin-shell", expanded && "is-sidebar-expanded")}>
      {expanded ? (
        <button
          type="button"
          className="admin-shell__backdrop"
          onClick={collapse}
          aria-label="Close menu"
        />
      ) : null}

      <Sidebar expanded={expanded} />

      <button
        type="button"
        className="admin-shell__rail-toggle"
        onClick={toggle}
        aria-expanded={expanded}
        aria-label={expanded ? t("collapseMenu") : t("expandMenu")}
      >
        <PanelToggleIcon expanded={expanded} />
      </button>

      <div className="admin-main">
        <Header />
        <div className="admin-content">{children}</div>
      </div>
    </div>
    </ActiveThemeProvider>
  );
}
