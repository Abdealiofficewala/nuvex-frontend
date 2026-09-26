import { AdminPage } from "@/components/admin/common/AdminPage";
import { IndustryForm } from "@/components/admin/industries/IndustryForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditIndustryPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="industriesListingEdit" wide hideDescription>
      <IndustryForm editId={id} />
    </AdminPage>
  );
}
