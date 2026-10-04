import { AdminPage } from "@/components/admin/common/AdminPage";
import { MasterEntityForm } from "@/components/admin/products/master/MasterEntityForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="productMaterialsEdit" wide hideDescription>
      <MasterEntityForm masterKey="materials" editId={id} />
    </AdminPage>
  );
}
