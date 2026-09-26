import { AdminPage } from "@/components/admin/common/AdminPage";
import { ColorPaletteForm } from "@/components/admin/appearance/ColorPaletteForm";

export default function CreateColorPalettePage() {
  return (
    <AdminPage pageKey="themeColorsCreate" wide hideDescription>
      <ColorPaletteForm mode="create" />
    </AdminPage>
  );
}
