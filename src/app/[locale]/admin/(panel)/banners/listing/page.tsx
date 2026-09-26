import { AdminPage } from "@/components/admin/common/AdminPage";
import { BannersListing } from "@/components/admin/banners/BannersListing";

export default function AdminBannersListingPage() {
  return (
    <AdminPage pageKey="banners" wide>
      <BannersListing />
    </AdminPage>
  );
}
