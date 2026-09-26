import { AdminPage } from "@/components/admin/common/AdminPage";
import { TypesListing } from "@/components/admin/product-types/TypesListing";

export default function AdminProductTypesPage() {
  return (
    <AdminPage pageKey="productTypes" wide>
      <TypesListing />
    </AdminPage>
  );
}
