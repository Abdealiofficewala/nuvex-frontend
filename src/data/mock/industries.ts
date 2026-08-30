import type { Industry } from "@/types/industry";

export const mockIndustries: Industry[] = [
  {
    id: "ind-construction",
    slug: "construction",
    name: "Construction",
    summary: "Nails, anchors, and hex bolts for timber, masonry, and site steel.",
    description:
      "Wire nails, concrete nails, and foundation bolts packed for contractors who order by length and by kilogram, not by a machine drawing.",
    image: "/images/industries/construction.jpg",
    applications: ["Formwork", "Site steel", "Masonry battens"],
  },
  {
    id: "ind-mfg",
    slug: "industrial-manufacturing",
    name: "Industrial Manufacturing",
    summary: "Hex bolts and lock nuts for frames that come apart for service.",
    description:
      "Grade-marked bolts and nyloc nuts for machine builders who need a fastener that still undoes after a year on the line.",
    image: "/images/industries/manufacturing.jpg",
    applications: ["Machine frames", "Guard rails", "Conveyor joints"],
  },
  {
    id: "ind-auto",
    slug: "automotive",
    name: "Automotive",
    summary: "Screws and lock nuts for bodies, fixtures, and service kits.",
    description:
      "Machine screws and prevailing-torque nuts for shops that cannot have a joint walk off under vibration.",
    image: "/images/industries/automotive.jpg",
    applications: ["Body fixtures", "Service kits", "Jig hardware"],
  },
  {
    id: "ind-electrical",
    slug: "electrical",
    name: "Electrical",
    summary: "Machine screws for panels, covers, and gland plates.",
    description:
      "M3 to M6 screws in pan and CSK so a panel shop is not mixing leftover hardware from three tins.",
    image: "/images/industries/electrical.jpg",
    applications: ["PLC cabinets", "Junction boxes", "Nameplates"],
  },
  {
    id: "ind-infra",
    slug: "infrastructure",
    name: "Infrastructure",
    summary: "Anchor bolts and galvanized hex sets for outdoor plant.",
    description:
      "Hot-dip or zinc sets for bases, columns, and outdoor frames where rust on the first monsoon is not acceptable.",
    image: "/images/industries/infrastructure.jpg",
    applications: ["Pump bases", "Shed columns", "Utility frames"],
  },
  {
    id: "ind-machine",
    slug: "machinery",
    name: "Machinery",
    summary: "Standard metric bolts and nuts held as store items, not one-off parts.",
    description:
      "OEM and MRO fasteners in the sizes a drawing already uses, packed so a stores bin can be refilled without a new part number.",
    image: "/images/industries/machinery.jpg",
    applications: ["OEM kits", "MRO bins", "Sub-assembly"],
  },
];
