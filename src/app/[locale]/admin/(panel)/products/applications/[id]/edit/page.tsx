import { AdminPage } from "@/components/admin/common/AdminPage";
import { MasterEntityForm } from "@/components/admin/products/master/MasterEntityForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="productApplicationsEdit" wide hideDescription>
      <MasterEntityForm masterKey="applications" editId={id} />
    </AdminPage>
  );
}
