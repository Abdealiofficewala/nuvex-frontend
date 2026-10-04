"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { AdminPageLoader } from "@/components/admin/common/AdminPageLoader";
import { ROUTES } from "@/lib/constants";
import { trackAdminLogin } from "@/lib/admin-access";
import {
  fetchAdminSessionFromCookie,
  getAdminSession,
  getAdminUserEmail,
  setAdminSessionLocal,
  syncAdminSessionCookie,
} from "@/lib/admin-session";

type AuthGateProps = {
  children: React.ReactNode;
};

type AuthStatus = "checking" | "authed" | "guest";

export function AuthGate({ children }: AuthGateProps) {
  const router = useRouter();
  const [status, setStatus] = useState<AuthStatus>("checking");

  useEffect(() => {
    let cancelled = false;

    async function resolveSession() {
      if (getAdminSession()) {
        const email = getAdminUserEmail();
        if (email) {
          await syncAdminSessionCookie(email);
          trackAdminLogin(email);
        }
        if (!cancelled) {
          setStatus("authed");
        }
        return;
      }

      const email = await fetchAdminSessionFromCookie();
      if (cancelled) {
        return;
      }

      if (email) {
        setAdminSessionLocal(email);
        trackAdminLogin(email);
        setStatus("authed");
        return;
      }

      setStatus("guest");
    }

    void resolveSession();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (status === "guest") {
      router.replace(ROUTES.admin.login);
    }
  }, [status, router]);

  if (status !== "authed") {
    return <AdminPageLoader fullScreen />;
  }

  return children;
}
