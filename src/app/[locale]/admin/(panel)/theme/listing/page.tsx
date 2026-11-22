import { AdminPage } from "@/components/admin/common/AdminPage";
import { ThemesListing } from "@/components/admin/appearance/ThemesListing";

export default function AdminThemesListingPage() {
  return (
    <AdminPage pageKey="themeListing" wide hideDescription>
      <ThemesListing />
    </AdminPage>
  );
}
