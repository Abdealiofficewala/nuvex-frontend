import { AdminPage } from "@/components/admin/common/AdminPage";
import { ViewIndustryDetail } from "@/components/admin/industries/ViewIndustryDetail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ViewIndustryPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="industriesListingView" wide hideDescription>
      <ViewIndustryDetail id={id} />
    </AdminPage>
  );
}
