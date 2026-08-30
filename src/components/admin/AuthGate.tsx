"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "@/i18n/routing";
import { AdminPageLoader } from "@/components/admin/common/AdminPageLoader";
import { ROUTES } from "@/lib/constants";
import { getAdminSession } from "@/lib/admin-session";

function subscribe() {
  return () => undefined;
}

type AuthGateProps = {
  children: React.ReactNode;
};

export function AuthGate({ children }: AuthGateProps) {
  const router = useRouter();
  const isAuthed = useSyncExternalStore(subscribe, getAdminSession, () => false);

  useEffect(() => {
    if (!isAuthed) {
      router.replace(ROUTES.admin.login);
    }
  }, [isAuthed, router]);

  if (!isAuthed) {
    return <AdminPageLoader fullScreen />;
  }

  return children;
}
