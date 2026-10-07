import { AdminPage } from "@/components/admin/common/AdminPage";
import { ColorPaletteForm } from "@/components/admin/appearance/ColorPaletteForm";

export default function AdminColorPaletteCreatePage() {
  return (
    <AdminPage pageKey="themeColorsCreate" wide hideDescription>
      <ColorPaletteForm mode="create" />
    </AdminPage>
  );
}
