import { AdminPage } from "@/components/admin/common/AdminPage";
import { IndustryForm } from "@/components/admin/industries/IndustryForm";

export default function CreateIndustryPage() {
  return (
    <AdminPage pageKey="industriesListingCreate" wide hideDescription>
      <IndustryForm />
    </AdminPage>
  );
}
