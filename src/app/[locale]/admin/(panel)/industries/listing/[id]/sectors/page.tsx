import { AdminPage } from "@/components/admin/common/AdminPage";
import { ViewIndustryDetail } from "@/components/admin/industries/ViewIndustryDetail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ManageIndustrySectorsPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="industriesListingSectors" wide>
      <ViewIndustryDetail id={id} showSectors />
    </AdminPage>
  );
}
