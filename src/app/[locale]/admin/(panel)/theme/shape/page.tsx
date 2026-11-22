import { AdminPage } from "@/components/admin/common/AdminPage";
import { ShapeSettingsPanel } from "@/components/admin/appearance/ShapeSettingsPanel";

export default function AdminShapeSettingsPage() {
  return (
    <AdminPage pageKey="themeShape" wide hideDescription>
      <ShapeSettingsPanel />
    </AdminPage>
  );
}
