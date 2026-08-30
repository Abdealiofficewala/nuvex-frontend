import { siteConfig } from "@/config/site.config";
import { ROUTES } from "@/lib/constants";
import type { HomepageContent } from "@/types/homepage";

export const mockHomepage: HomepageContent = {
  hero: {
    eyebrow: "Fasteners",
    title: "Nuts, bolts, screws — ready to pack.",
    body: "Standard fasteners for fabrication, construction, and maintenance stores. Grade, size, and finish on the ticket — not a mixed bag from three mills.",
    image: "/images/hero/hero-assembly.jpg",
    primaryHref: ROUTES.products,
    secondaryHref: ROUTES.quote,
  },
  featuredProductId: "prd-hex-bolt",
  stats: siteConfig.business.stats.map((stat) => ({
    key: stat.key,
    value: stat.value,
    label: stat.label,
  })),
  benefits: [
    {
      key: "fit",
      title: "Thread that matches the nut",
      body: "Bolts and nuts are gauged as a pair so a site crate does not mix two mills on one joint.",
    },
    {
      key: "trace",
      title: "Grade-marked on the head",
      body: "8.8, 10.9, and stainless lots stay identified from bag to bin, not lost on a shared pallet.",
    },
    {
      key: "floor",
      title: "Packed the way stores issue them",
      body: "Count, kilogram, or set packing so a contractor can order like a store, not like a catalogue essay.",
    },
  ],
  infrastructure: {
    eyebrow: "Works",
    title: "Threading, finishing, and despatch under one roof.",
    body: "Bolts are headed and rolled, nuts are tapped, nails are drawn, and orders leave counted.",
    image: "/images/infrastructure/workshop.jpg",
  },
};
