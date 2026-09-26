import { notFound } from "next/navigation";
import { AdminPage } from "@/components/admin/common/AdminPage";
import { BrandingForm } from "@/components/admin/appearance/BrandingForm";
import { getBrandingById } from "@/lib/server/appearance-store";

type EditBrandingPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBrandingPage({ params }: EditBrandingPageProps) {
  const { id } = await params;

  try {
    const branding = await getBrandingById(id);

    return (
      <AdminPage pageKey="themeLogosEdit" wide hideDescription>
        <BrandingForm mode="edit" initial={branding} />
      </AdminPage>
    );
  } catch {
    notFound();
  }
}
