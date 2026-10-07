import { AdminPage } from "@/components/admin/common/AdminPage";
import { ColorPalettesListing } from "@/components/admin/appearance/ColorPalettesListing";

export default function AdminColorPalettesPage() {
  return (
    <AdminPage pageKey="themeColors" wide hideDescription>
      <ColorPalettesListing />
    </AdminPage>
  );
}
