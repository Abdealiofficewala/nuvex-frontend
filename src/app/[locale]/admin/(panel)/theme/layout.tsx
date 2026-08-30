import { AdminContentSidebar } from "@/components/admin/common/AdminContentSidebar";
import { AdminSectionLayout } from "@/components/admin/common/AdminSectionLayout";
import { getAdminMenuGroupChildren } from "@/lib/admin-menu";

type ThemeLayoutProps = {
  children: React.ReactNode;
};

export default function ThemeLayout({ children }: ThemeLayoutProps) {
  return (
    <AdminSectionLayout
      sidebar={<AdminContentSidebar titleKey="theme" pages={getAdminMenuGroupChildren("theme")} />}
    >
      {children}
    </AdminSectionLayout>
  );
}
