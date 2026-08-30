"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";
import { CompanyFactsTicket } from "@/components/website/about/CompanyFactsTicket";
import type { CompanyProfileState } from "@/lib/company-profile.config";
import {
  COMPANY_PROFILE_UPDATED_EVENT,
  getCompanyProfileState,
  getDefaultCompanyProfile,
} from "@/lib/company-profile";

export function AboutFactsTicket() {
  const t = useTranslations("about");
  const [profile, setProfile] = useState<CompanyProfileState>(() => getDefaultCompanyProfile());

  useEffect(() => {
    setProfile(getCompanyProfileState());

    const refresh = () => setProfile(getCompanyProfileState());
    window.addEventListener(COMPANY_PROFILE_UPDATED_EVENT, refresh);

    return () => window.removeEventListener(COMPANY_PROFILE_UPDATED_EVENT, refresh);
  }, []);

  const factLabels = useMemo(
    () => ({
      legal: t("facts.legal"),
      founded: t("facts.founded"),
      hq: t("facts.hq"),
      desk: t("facts.desk"),
      lines: t("facts.lines"),
      reach: t("facts.reach"),
      enquiries: t("facts.enquiries"),
      phone: t("facts.phone"),
    }),
    [t],
  );

  return (
    <Reveal className="about-facts" delay={120}>
      <CompanyFactsTicket profile={profile} factLabels={factLabels} />
    </Reveal>
  );
}
