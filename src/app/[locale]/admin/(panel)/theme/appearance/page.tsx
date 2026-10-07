import { AdminPage } from "@/components/admin/common/AdminPage";
import { GlobalAppearancePanel } from "@/components/admin/appearance/GlobalAppearancePanel";

export default function AdminAppearanceSettingsPage() {
  return (
    <AdminPage pageKey="themeAppearance" wide hideDescription>
      <GlobalAppearancePanel />
    </AdminPage>
  );
}
