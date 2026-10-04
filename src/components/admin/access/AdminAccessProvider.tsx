"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  canAccessPage,
  resolveAccessForEmail,
  type AdminPageAction,
} from "@/lib/admin-access";
import type { AdminUserPageAccess } from "@/lib/admin-page-access.config";
import type { AdminAccessPageId, AdminMenuPage } from "@/lib/admin-menu";
import { ADMIN_ROLES_UPDATED_EVENT, ensureAdminRolesSeeded } from "@/lib/admin-roles";
import { ADMIN_USERS_UPDATED_EVENT } from "@/lib/admin-users";
import { getAdminUserEmail } from "@/lib/admin-session";

type AdminAccessContextValue = {
  email: string | null;
  access: AdminUserPageAccess;
  canAccessPage: (pageId: AdminAccessPageId, action?: AdminPageAction) => boolean;
  canViewMenuPage: (page: AdminMenuPage) => boolean;
  refreshAccess: () => void;
};

const AdminAccessContext = createContext<AdminAccessContextValue | null>(null);

export function AdminAccessProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [access, setAccess] = useState<AdminUserPageAccess>(() => resolveAccessForEmail(null));

  const refreshAccess = useCallback(() => {
    ensureAdminRolesSeeded();
    const nextEmail = getAdminUserEmail();
    setEmail(nextEmail);
    setAccess(resolveAccessForEmail(nextEmail));
  }, []);

  useEffect(() => {
    refreshAccess();

    const onStorage = () => refreshAccess();
    window.addEventListener(ADMIN_USERS_UPDATED_EVENT, refreshAccess);
    window.addEventListener(ADMIN_ROLES_UPDATED_EVENT, refreshAccess);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener(ADMIN_USERS_UPDATED_EVENT, refreshAccess);
      window.removeEventListener(ADMIN_ROLES_UPDATED_EVENT, refreshAccess);
      window.removeEventListener("storage", onStorage);
    };
  }, [refreshAccess]);

  const value = useMemo<AdminAccessContextValue>(
    () => ({
      email,
      access,
      refreshAccess,
      canAccessPage: (pageId, action = "view") => canAccessPage(access, pageId, action),
      canViewMenuPage: (page) => canAccessPage(access, page.accessId, "view"),
    }),
    [access, email, refreshAccess],
  );

  return <AdminAccessContext.Provider value={value}>{children}</AdminAccessContext.Provider>;
}

export function useAdminAccess() {
  const context = useContext(AdminAccessContext);
  if (!context) {
    throw new Error("useAdminAccess must be used within AdminAccessProvider");
  }

  return context;
}
