import "@/components/admin/admin.css";
import { AdminProviders } from "@/components/admin/AdminProviders";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <AdminProviders>{children}</AdminProviders>;
}
