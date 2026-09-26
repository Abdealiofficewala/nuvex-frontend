import { notFound } from "next/navigation";
import { AdminPage } from "@/components/admin/common/AdminPage";
import { BrandingViewDetail } from "@/components/admin/appearance/BrandingViewDetail";
import { getBrandingById } from "@/lib/server/appearance-store";

type ViewBrandingPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ViewBrandingPage({ params }: ViewBrandingPageProps) {
  const { id } = await params;

  try {
    const branding = await getBrandingById(id);

    return (
      <AdminPage pageKey="themeLogosView" wide hideDescription>
        <BrandingViewDetail branding={branding} />
      </AdminPage>
    );
  } catch {
    notFound();
  }
}
