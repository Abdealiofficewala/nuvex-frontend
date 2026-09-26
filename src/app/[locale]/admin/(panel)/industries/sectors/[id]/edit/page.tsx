import { AdminPage } from "@/components/admin/common/AdminPage";
import { SectorForm } from "@/components/admin/industries/SectorForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditSectorPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="sectorsEdit" wide hideDescription>
      <SectorForm editId={id} />
    </AdminPage>
  );
}
