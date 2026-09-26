import { AdminPage } from "@/components/admin/common/AdminPage";
import { ViewSectorDetail } from "@/components/admin/industries/ViewSectorDetail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ViewSectorPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="sectorsView" wide hideDescription>
      <ViewSectorDetail id={id} />
    </AdminPage>
  );
}
