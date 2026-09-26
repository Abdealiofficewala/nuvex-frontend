import { AdminPage } from "@/components/admin/common/AdminPage";
import { ProductForm } from "@/components/admin/products/ProductForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="productsListingEdit" wide hideDescription>
      <ProductForm editId={id} />
    </AdminPage>
  );
}
