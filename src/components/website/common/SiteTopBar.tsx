"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { SiteTopBarContent } from "@/components/website/common/SiteTopBarContent";
import {
  SITE_TOP_BAR_UPDATED_EVENT,
  getWebsiteSiteTopBarState,
  resolveSiteTopBarDisplay,
  type SiteTopBarDisplay,
} from "@/lib/site-top-bar";

export function SiteTopBar() {
  const t = useTranslations("common");
  const detailLabels = useMemo(
    () => ({
      phone: t("topBar.phone"),
      email: t("topBar.email"),
      location: t("topBar.location"),
    }),
    [t],
  );

  const [display, setDisplay] = useState<SiteTopBarDisplay>(() =>
    resolveSiteTopBarDisplay(getWebsiteSiteTopBarState(), detailLabels),
  );

  useEffect(() => {
    const refresh = () => {
      setDisplay(resolveSiteTopBarDisplay(getWebsiteSiteTopBarState(), detailLabels));
    };

    refresh();
    window.addEventListener(SITE_TOP_BAR_UPDATED_EVENT, refresh);

    return () => {
      window.removeEventListener(SITE_TOP_BAR_UPDATED_EVENT, refresh);
    };
  }, [detailLabels]);

  return <SiteTopBarContent display={display} />;
}
