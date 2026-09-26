import { AdminPage } from "@/components/admin/common/AdminPage";
import { ThemeForm } from "@/components/admin/appearance/ThemeForm";

export default function CreateThemePage() {
  return (
    <AdminPage pageKey="themeCreate" hideDescription>
      <ThemeForm mode="create" />
    </AdminPage>
  );
}
