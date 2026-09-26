import { AdminPage } from "@/components/admin/common/AdminPage";
import { IndustriesListing } from "@/components/admin/industries/IndustriesListing";

export default function AdminIndustriesListingPage() {
  return (
    <AdminPage pageKey="industriesListing" wide>
      <IndustriesListing />
    </AdminPage>
  );
}
