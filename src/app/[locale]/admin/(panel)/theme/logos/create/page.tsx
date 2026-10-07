import { AdminPage } from "@/components/admin/common/AdminPage";
import { BrandingForm } from "@/components/admin/appearance/BrandingForm";

export default function AdminBrandingCreatePage() {
  return (
    <AdminPage pageKey="themeLogosCreate" wide hideDescription>
      <BrandingForm mode="create" />
    </AdminPage>
  );
}
