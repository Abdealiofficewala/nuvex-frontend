import { AdminPage } from "@/components/admin/common/AdminPage";
import { ViewCategoryDetail } from "@/components/admin/categories/ViewCategoryDetail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ViewCategoryPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="productCategoriesView" wide hideDescription>
      <ViewCategoryDetail id={id} />
    </AdminPage>
  );
}
