import { AdminPage } from "@/components/admin/common/AdminPage";
import { TypeForm } from "@/components/admin/product-types/TypeForm";

type EditProductTypePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductTypePage({ params }: EditProductTypePageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="productTypesEdit" wide hideDescription>
      <TypeForm editId={id} />
    </AdminPage>
  );
}
