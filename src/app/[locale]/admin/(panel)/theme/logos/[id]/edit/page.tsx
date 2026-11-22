import { AdminPage } from "@/components/admin/common/AdminPage";
import { BrandingEditLoader } from "@/components/admin/appearance/BrandingEditLoader";

type AdminBrandingEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminBrandingEditPage({ params }: AdminBrandingEditPageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="themeLogosEdit" wide hideDescription>
      <BrandingEditLoader id={id} />
    </AdminPage>
  );
}
