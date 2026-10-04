import { AuthGate } from "@/components/admin/AuthGate";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminAccessProvider } from "@/components/admin/access/AdminAccessProvider";
import { AdminRouteGuard } from "@/components/admin/access/AdminRouteGuard";

type AdminPanelLayoutProps = {
  children: React.ReactNode;
};

export default function AdminPanelLayout({ children }: AdminPanelLayoutProps) {
  return (
    <AuthGate>
      <AdminAccessProvider>
        <AdminShell>
          <AdminRouteGuard>{children}</AdminRouteGuard>
        </AdminShell>
      </AdminAccessProvider>
    </AuthGate>
  );
}
