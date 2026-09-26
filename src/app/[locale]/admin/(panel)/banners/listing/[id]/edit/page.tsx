import { AdminPage } from "@/components/admin/common/AdminPage";
import { BannerForm } from "@/components/admin/banners/BannerForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBannerPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="bannersEdit" wide hideDescription>
      <BannerForm editId={id} />
    </AdminPage>
  );
}
