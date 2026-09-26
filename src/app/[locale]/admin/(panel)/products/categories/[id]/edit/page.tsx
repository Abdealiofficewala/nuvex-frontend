import { AdminPage } from "@/components/admin/common/AdminPage";
import { CategoryForm } from "@/components/admin/categories/CategoryForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="productCategoriesEdit" wide hideDescription>
      <CategoryForm editId={id} />
    </AdminPage>
  );
}
