import { AdminPage } from "@/components/admin/common/AdminPage";
import { ThemesListing } from "@/components/admin/appearance/ThemesListing";

export default function AdminThemeListingPage() {
  return (
    <AdminPage pageKey="themeListing" wide>
      <ThemesListing />
    </AdminPage>
  );
}
