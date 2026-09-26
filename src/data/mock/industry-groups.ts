import type { IndustryInput } from "@/types/content-admin";

export const mockIndustryGroups: IndustryInput[] = [
  {
    slug: "built-environment",
    name: "Built Environment",
    summary: "Construction, infrastructure, and site-ready fastening programs.",
    description:
      "Fastener packs for contractors and infrastructure teams who order by length, grade, and site-ready quantity.",
    image: "/images/industries/infrastructure.jpg",
    status: "active",
    sortOrder: 1,
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    summary: "Production lines, OEM kits, and industrial assembly hardware.",
    description:
      "Grade-marked bolts, nuts, and screws for machine builders, automotive shops, and OEM stores teams.",
    image: "/images/industries/manufacturing.jpg",
    status: "active",
    sortOrder: 2,
  },
  {
    slug: "technical-services",
    name: "Technical Services",
    summary: "Panel, electrical, and precision assembly applications.",
    description:
      "Machine screws and panel hardware for electrical, controls, and technical assembly workflows.",
    image: "/images/industries/electrical.jpg",
    status: "active",
    sortOrder: 3,
  },
];

export const mockSectorIndustryMap: Record<string, string> = {
  "ind-construction": "built-environment",
  infrastructure: "built-environment",
  "industrial-manufacturing": "manufacturing",
  machinery: "manufacturing",
  automotive: "manufacturing",
  electrical: "technical-services",
};
