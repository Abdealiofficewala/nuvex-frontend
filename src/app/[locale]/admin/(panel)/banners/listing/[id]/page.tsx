import { AdminPage } from "@/components/admin/common/AdminPage";
import { ViewBannerDetail } from "@/components/admin/banners/ViewBannerDetail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ViewBannerPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="bannersView" wide hideDescription>
      <ViewBannerDetail id={id} />
    </AdminPage>
  );
}
