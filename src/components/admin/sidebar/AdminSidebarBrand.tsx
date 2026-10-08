"use client";

import { useActiveThemeOptional } from "@/components/admin/appearance/ActiveThemeProvider";
import { Logo } from "@/components/ui/Logo";
import { siteConfig } from "@/config/site.config";
import { Link } from "@/i18n/routing";
import { ROUTES } from "@/lib/constants";
import { useThemeOptional } from "@/providers/ThemeProvider";
import { cn } from "@/lib/utils";

const MARK_SIZE = 30;

type AdminSidebarBrandProps = {
  expanded: boolean;
};

function useCompanyDisplayName() {
  const adminTheme = useActiveThemeOptional();
  const publicTheme = useThemeOptional();
  const resolved =
    adminTheme?.previewResolved ??
    adminTheme?.resolved ??
    publicTheme?.previewResolved ??
    publicTheme?.resolved;

  const branding = resolved?.branding;

  return (
    branding?.applicationName?.trim() ||
    branding?.brandName?.trim() ||
    siteConfig.company.name
  );
}

export function AdminSidebarBrand({ expanded }: AdminSidebarBrandProps) {
  const companyName = useCompanyDisplayName();

  return (
    <Link
      href={ROUTES.admin.dashboard}
      className={cn("admin-sidebar__brand", expanded && "is-expanded")}
      aria-label={companyName}
    >
      <Logo
        variant="mobile"
        height={MARK_SIZE}
        width={MARK_SIZE}
        className="admin-sidebar__brand-mark"
        priority
      />
      <span className="admin-sidebar__brand-name">{companyName}</span>
    </Link>
  );
}
