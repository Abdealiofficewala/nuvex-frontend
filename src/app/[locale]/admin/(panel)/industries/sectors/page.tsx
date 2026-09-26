import { AdminPage } from "@/components/admin/common/AdminPage";
import { SectorsListing } from "@/components/admin/industries/SectorsListing";

export default function AdminIndustriesSectorsPage() {
  return (
    <AdminPage pageKey="sectors" wide>
      <SectorsListing />
    </AdminPage>
  );
}
