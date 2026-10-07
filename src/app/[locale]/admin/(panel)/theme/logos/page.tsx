import { AdminPage } from "@/components/admin/common/AdminPage";
import { BrandingListing } from "@/components/admin/appearance/BrandingListing";

export default function AdminBrandingListingPage() {
  return (
    <AdminPage pageKey="themeLogos" wide hideDescription>
      <BrandingListing />
    </AdminPage>
  );
}
