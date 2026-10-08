import type { HomepageStat } from "@/types/homepage";

export type CompanyStrengthLayout = "backdrop" | "split" | "media-end";

export type CompanyStrengthVisual = {
  image: string;
  imageAlt: string;
  layout: CompanyStrengthLayout;
};

export const COMPANY_STRENGTH_VISUALS: Record<string, CompanyStrengthVisual> = {
  years: {
    image: "/images/infrastructure/workshop.jpg",
    imageAlt: "Hakimi Industries workshop with threading, finishing, and dispatch under one roof",
    layout: "backdrop",
  },
  products: {
    image: "/images/hero/hero-assembly.jpg",
    imageAlt: "Assorted bolts, nuts, screws, and nails from the Hakimi fastener catalogue",
    layout: "split",
  },
  applications: {
    image: "/images/categories/bolts.jpg",
    imageAlt: "Industrial bolt line from Hakimi Industries catalogue families",
    layout: "split",
  },
  countries: {
    image: "/images/industries/infrastructure.jpg",
    imageAlt: "Infrastructure and construction supply across Indian states and export markets",
    layout: "media-end",
  },
};

export type ResolvedCompanyStrengthStat = HomepageStat & CompanyStrengthVisual;

function statCopy(stat: HomepageStat): Pick<HomepageStat, "title" | "description"> {
  if (stat.title && stat.description) {
    return { title: stat.title, description: stat.description };
  }
  if (stat.label) {
    return { title: stat.label, description: "" };
  }
  return { title: "", description: "" };
}

export function resolveCompanyStrengthStat(stat: HomepageStat): ResolvedCompanyStrengthStat {
  const visual = COMPANY_STRENGTH_VISUALS[stat.key];
  const copy = statCopy(stat);
  return {
    ...stat,
    ...copy,
    image: stat.image ?? visual?.image ?? "",
    imageAlt: stat.imageAlt ?? visual?.imageAlt ?? "",
    layout: visual?.layout ?? "split",
  };
}
