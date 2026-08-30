import type { Project } from "@/types/project";

export const mockProjects: Project[] = [
  {
    id: "prj-ledger",
    slug: "lending-operations",
    title: "Lending operations desk",
    client: "Regional finance team",
    industry: "Fintech",
    summary: "A case review workspace that replaced a patchwork of sheets, mail, and chat.",
    description:
      "Underwriters needed a single place to see applicant history, documents, and decisions. We delivered a review desk with role-based access and a clear audit trail.",
    outcomes: [
      "Case cycle time reduced by 38%",
      "Every decision left a recoverable record",
      "New reviewers productive in the first week",
    ],
    technologies: ["Next.js", "Node.js", "MongoDB", "TypeScript"],
    year: 2025,
  },
  {
    id: "prj-clinic",
    slug: "clinic-scheduling",
    title: "Clinic scheduling network",
    client: "Multi-site care group",
    industry: "Healthcare",
    summary: "Appointment flow across locations without asking staff to reconcile calendars by hand.",
    description:
      "We built a scheduling layer that respects clinician availability, room constraints, and patient follow-up so front desks stop double-booking.",
    outcomes: [
      "No-show rate dropped after reminder automation",
      "Front-desk work concentrated on exceptions",
      "Locations shared one availability model",
    ],
    technologies: ["React", "Express", "MongoDB", "AWS"],
    year: 2025,
  },
  {
    id: "prj-commerce",
    slug: "wholesale-commerce",
    title: "Wholesale commerce console",
    client: "Specialty retailer",
    industry: "Retail",
    summary: "Order, inventory, and partner pricing in one console instead of three vendors.",
    description:
      "The team needed a quieter way to manage B2B orders. We replaced a brittle stack with a console that buyers and warehouse staff could both trust.",
    outcomes: [
      "Order errors fell after shared inventory",
      "Partner-specific pricing became explicit",
      "Warehouse and sales used the same numbers",
    ],
    technologies: ["Next.js", "Node.js", "PostgreSQL", "TypeScript"],
    year: 2024,
  },
];
