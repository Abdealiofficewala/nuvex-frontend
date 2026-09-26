export type StaticProductType = {
  categorySlug: string;
  categoryName: string;
  slug: string;
  name: string;
  summary: string;
};

/** Reference types used across the catalogue. Managed in admin → Types. */
export const STATIC_PRODUCT_TYPES: StaticProductType[] = [
  {
    categorySlug: "bolts",
    categoryName: "Bolts",
    slug: "hex-bolts",
    name: "Hex bolts",
    summary: "Metric hex head bolts for frames, machines, and site work.",
  },
  {
    categorySlug: "bolts",
    categoryName: "Bolts",
    slug: "anchor-bolts",
    name: "Anchor bolts",
    summary: "Foundation and base anchor bolts to drawing.",
  },
  {
    categorySlug: "nuts",
    categoryName: "Nuts",
    slug: "hex-nuts",
    name: "Hex nuts",
    summary: "Hex nuts matched to bolt threads.",
  },
  {
    categorySlug: "nuts",
    categoryName: "Nuts",
    slug: "lock-nuts",
    name: "Lock nuts",
    summary: "Nyloc and prevailing-torque lock nuts.",
  },
  {
    categorySlug: "screws",
    categoryName: "Screws",
    slug: "ss-screw",
    name: "SS Screw",
    summary: "Stainless Steel — Outdoor, kitchen, marine, general applications",
  },
  {
    categorySlug: "screws",
    categoryName: "Screws",
    slug: "ms-screw",
    name: "MS Screw",
    summary: "Mild Steel — General engineering and fabrication",
  },
  {
    categorySlug: "screws",
    categoryName: "Screws",
    slug: "cs-screw",
    name: "CS Screw",
    summary: "Carbon Steel — Machinery and heavy-duty applications",
  },
  {
    categorySlug: "screws",
    categoryName: "Screws",
    slug: "brass-screw",
    name: "Brass Screw",
    summary: "Brass — Electrical, decorative, corrosion-resistant applications",
  },
  {
    categorySlug: "screws",
    categoryName: "Screws",
    slug: "copper-screw",
    name: "Copper Screw",
    summary: "Copper — Electrical and corrosion-resistant applications",
  },
  {
    categorySlug: "screws",
    categoryName: "Screws",
    slug: "aluminium-screw",
    name: "Aluminium Screw",
    summary: "Aluminium — Lightweight applications",
  },
  {
    categorySlug: "screws",
    categoryName: "Screws",
    slug: "gi-screw",
    name: "GI Screw",
    summary: "Galvanized Iron/Steel — Outdoor and corrosion-resistant applications",
  },
  {
    categorySlug: "screws",
    categoryName: "Screws",
    slug: "zinc-plated-screw",
    name: "Zinc-Plated Screw",
    summary: "Zinc-coated Steel — General-purpose corrosion protection",
  },
  {
    categorySlug: "screws",
    categoryName: "Screws",
    slug: "black-oxide-screw",
    name: "Black Oxide Screw",
    summary: "Black-oxide coated steel — Machinery and engineering",
  },
  {
    categorySlug: "screws",
    categoryName: "Screws",
    slug: "alloy-steel-screw",
    name: "Alloy Steel Screw",
    summary: "Alloy Steel — High-strength applications",
  },
  {
    categorySlug: "screws",
    categoryName: "Screws",
    slug: "titanium-screw",
    name: "Titanium Screw",
    summary: "Titanium — Aerospace, medical, specialized applications",
  },
  {
    categorySlug: "nails",
    categoryName: "Nails",
    slug: "wire-nails",
    name: "Wire nails",
    summary: "Common wire nails for carpentry and packing crates.",
  },
  {
    categorySlug: "nails",
    categoryName: "Nails",
    slug: "concrete-nails",
    name: "Concrete nails",
    summary: "Hardened nails for masonry and block.",
  },
];
