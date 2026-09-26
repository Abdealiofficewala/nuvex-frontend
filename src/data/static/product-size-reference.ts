export type StaticSizePreset = {
  id: string;
  name: string;
  categorySlug: string;
  labels: string[];
  note: string;
};

/** Common size label presets — copy into a product's Sizes & images section in Admin. Each row still needs its own image. */
export const STATIC_SIZE_PRESETS: StaticSizePreset[] = [
  {
    id: "metric-hex-bolts",
    name: "Metric hex bolts (diameter × length)",
    categorySlug: "bolts",
    labels: ["M6 × 20 mm", "M8 × 25 mm", "M10 × 40 mm", "M12 × 50 mm", "M16 × 70 mm", "M20 × 90 mm"],
    note: "Typical stocked lengths for grade 8.8 hex bolts.",
  },
  {
    id: "anchor-bolts",
    name: "Foundation anchor bolts",
    categorySlug: "bolts",
    labels: ["M12 × 150 mm", "M16 × 200 mm", "M20 × 250 mm", "M24 × 300 mm"],
    note: "Shank lengths to civil or fabrication drawing.",
  },
  {
    id: "hex-nuts",
    name: "Hex nuts (thread size)",
    categorySlug: "nuts",
    labels: ["M6", "M8", "M10", "M12", "M16", "M20", "M24"],
    note: "Nut size only — pair with matching bolt thread.",
  },
  {
    id: "lock-nuts",
    name: "Lock nuts (nyloc)",
    categorySlug: "nuts",
    labels: ["M6", "M8", "M10", "M12", "M16"],
    note: "Prevailing-torque insert nuts.",
  },
  {
    id: "machine-screws",
    name: "Machine screws (diameter × length)",
    categorySlug: "screws",
    labels: ["M3 × 10 mm", "M4 × 12 mm", "M5 × 16 mm", "M6 × 20 mm", "M8 × 25 mm"],
    note: "Common panel and cover screws.",
  },
  {
    id: "self-tapping",
    name: "Self-tapping screws (gauge × length)",
    categorySlug: "screws",
    labels: ["No.6 × 12 mm", "No.8 × 20 mm", "No.10 × 25 mm", "No.12 × 40 mm"],
    note: "Sheet and light-gauge fabrication.",
  },
  {
    id: "wire-nails",
    name: "Wire nails (length)",
    categorySlug: "nails",
    labels: ["25 mm", "40 mm", "50 mm", "75 mm", "100 mm", "125 mm"],
    note: "Sold by length, weight, or count.",
  },
  {
    id: "concrete-nails",
    name: "Concrete nails (length)",
    categorySlug: "nails",
    labels: ["25 mm", "40 mm", "50 mm", "65 mm"],
    note: "Hardened masonry nails.",
  },
];
