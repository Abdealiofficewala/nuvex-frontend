import { AdminPage } from "@/components/admin/common/AdminPage";
import { CategoryForm } from "@/components/admin/categories/CategoryForm";

export default function CreateCategoryPage() {
  return (
    <AdminPage pageKey="productCategoriesCreate" wide hideDescription>
      <CategoryForm />
    </AdminPage>
  );
}
