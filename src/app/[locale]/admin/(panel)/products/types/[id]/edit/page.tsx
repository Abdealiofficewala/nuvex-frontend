import { AdminPage } from "@/components/admin/common/AdminPage";
import { TypeMasterForm } from "@/components/admin/products/master/TypeMasterForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="productTypesEdit" wide hideDescription>
      <TypeMasterForm editId={id} />
    </AdminPage>
  );
}
