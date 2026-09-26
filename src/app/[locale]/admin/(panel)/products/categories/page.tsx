import { AdminPage } from "@/components/admin/common/AdminPage";
import { CategoriesListing } from "@/components/admin/categories/CategoriesListing";

export default function AdminProductCategoriesPage() {
  return (
    <AdminPage pageKey="productCategories" wide>
      <CategoriesListing />
    </AdminPage>
  );
}
