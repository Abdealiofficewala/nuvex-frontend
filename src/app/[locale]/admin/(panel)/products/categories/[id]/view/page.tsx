import { AdminPage } from "@/components/admin/common/AdminPage";
import { MasterEntityView } from "@/components/admin/products/master/MasterEntityView";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="productCategoriesView" wide hideDescription>
      <MasterEntityView masterKey="categories" id={id} />
    </AdminPage>
  );
}
