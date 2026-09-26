import { AdminPage } from "@/components/admin/common/AdminPage";
import { ColorPalettesListing } from "@/components/admin/appearance/ColorPalettesListing";

export default function AdminColorPalettesListingPage() {
  return (
    <AdminPage pageKey="themeColors" wide>
      <ColorPalettesListing />
    </AdminPage>
  );
}
