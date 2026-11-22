import { AdminPage } from "@/components/admin/common/AdminPage";
import { ThemeForm } from "@/components/admin/appearance/ThemeForm";

export default function AdminThemeCreatePage() {
  return (
    <AdminPage pageKey="themeCreate" wide hideDescription>
      <ThemeForm mode="create" />
    </AdminPage>
  );
}
