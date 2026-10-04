import { AdminPage } from "@/components/admin/common/AdminPage";
import { MasterEntityView } from "@/components/admin/products/master/MasterEntityView";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="productAttributesView" wide hideDescription>
      <MasterEntityView masterKey="attributes" id={id} />
    </AdminPage>
  );
}
