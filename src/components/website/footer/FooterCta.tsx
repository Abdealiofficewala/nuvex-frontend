"use client";

import { usePathname } from "@/i18n/routing";
import { ROUTES } from "@/lib/constants";

type FooterCtaProps = {
  children: React.ReactNode;
};

export function FooterCta({ children }: FooterCtaProps) {
  const pathname = usePathname();
  const onQuoteFlow = pathname === ROUTES.quote || pathname.startsWith(`${ROUTES.quote}/`);

  if (onQuoteFlow) {
    return null;
  }

  return children;
}
