import { AdminPage } from "@/components/admin/common/AdminPage";
import { BrandingViewLoader } from "@/components/admin/appearance/BrandingViewLoader";

type AdminBrandingViewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminBrandingViewPage({ params }: AdminBrandingViewPageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="themeLogosView" wide hideDescription>
      <BrandingViewLoader id={id} />
    </AdminPage>
  );
}
