import { AdminPage } from "@/components/admin/common/AdminPage";
import { ProductJsonGuide } from "@/components/admin/products/ProductJsonGuide";
import { ProductsListing } from "@/components/admin/products/ProductsListing";

export default function AdminProductsListingPage() {
  return (
    <AdminPage pageKey="productsListing" wide>
      <div className="admin-products-listing-page">
        <ProductsListing />
        <ProductJsonGuide />
      </div>
    </AdminPage>
  );
}
