"use client";

import { ToastProvider } from "@/components/ui/toast";

type AdminProvidersProps = {
  children: React.ReactNode;
};

export function AdminProviders({ children }: AdminProvidersProps) {
  return <ToastProvider>{children}</ToastProvider>;
}
