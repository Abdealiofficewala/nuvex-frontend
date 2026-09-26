import { AdminPage } from "@/components/admin/common/AdminPage";
import { SectorForm } from "@/components/admin/industries/SectorForm";

export default function CreateSectorPage() {
  return (
    <AdminPage pageKey="sectorsCreate" wide hideDescription>
      <SectorForm />
    </AdminPage>
  );
}
