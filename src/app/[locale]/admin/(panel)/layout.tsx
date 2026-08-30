import { AuthGate } from "@/components/admin/AuthGate";
import { AdminShell } from "@/components/admin/AdminShell";

type AdminPanelLayoutProps = {
  children: React.ReactNode;
};

export default function AdminPanelLayout({ children }: AdminPanelLayoutProps) {
  return (
    <AuthGate>
      <AdminShell>{children}</AdminShell>
    </AuthGate>
  );
}
