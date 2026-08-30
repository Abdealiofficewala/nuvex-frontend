import type { Service, Solution } from "@/types/service";

export const mockServices: Service[] = [
  {
    id: "svc-software",
    slug: "custom-software",
    title: "Custom software",
    summary: "Products and internal tools shaped around how your team actually works.",
    description:
      "We design, build, and refine web applications with a bias for clarity: typed contracts, readable architecture, and releases that operations can trust.",
    icon: "layers",
  },
  {
    id: "svc-cloud",
    slug: "cloud-platforms",
    title: "Cloud platforms",
    summary: "Infrastructure that is boring in the best way — observable, recoverable, and cost-aware.",
    description:
      "From first deploy to production hardening, we set up cloud foundations that keep delivery moving without turning every change into a fire drill.",
    icon: "cloud",
  },
  {
    id: "svc-product",
    slug: "product-design",
    title: "Product design",
    summary: "Interfaces that make complex work feel obvious.",
    description:
      "Research, information architecture, and interface design sit next to engineering so the product you ship matches the one people can use.",
    icon: "pen",
  },
  {
    id: "svc-data",
    slug: "data-and-ai",
    title: "Data & AI",
    summary: "Practical intelligence layered onto systems you already run.",
    description:
      "We help teams collect cleaner data, surface it where decisions happen, and introduce AI only where it reduces work rather than adding theater.",
    icon: "spark",
  },
  {
    id: "svc-quality",
    slug: "quality-engineering",
    title: "Quality engineering",
    summary: "Confidence in every release, not a scramble after it.",
    description:
      "Automated checks, environment strategy, and release discipline so quality is part of the pipeline instead of a gate at the end.",
    icon: "shield",
  },
  {
    id: "svc-transformation",
    slug: "digital-transformation",
    title: "Digital transformation",
    summary: "Replace fragile processes with software your people will keep using.",
    description:
      "We map the current operation, isolate the highest-leverage workflows, and replace them with systems that survive the next year of change.",
    icon: "refresh",
  },
];

export const mockSolutions: Solution[] = [
  {
    id: "sol-operations",
    slug: "operations-platforms",
    title: "Operations platforms",
    summary: "One place for the work that currently lives in spreadsheets and inboxes.",
    description:
      "Custom operational systems for teams who have outgrown generic tools but cannot pause the business to rebuild everything at once.",
    outcomes: [
      "Shared source of truth",
      "Fewer hand-offs",
      "Audit-ready history",
    ],
  },
  {
    id: "sol-customer",
    slug: "customer-portals",
    title: "Customer portals",
    summary: "Let clients see status, documents, and next steps without calling someone.",
    description:
      "Secure, branded portals that sit on top of your existing records so customers get answers and your team gets fewer interruptions.",
    outcomes: [
      "Self-serve status",
      "Lower support load",
      "Clearer client trust",
    ],
  },
  {
    id: "sol-internal",
    slug: "internal-products",
    title: "Internal products",
    summary: "Software for the people who run the company, not just the people who buy from it.",
    description:
      "We treat internal tools with the same care as customer products: research, design, and engineering that respect the people doing the work.",
    outcomes: [
      "Faster onboarding",
      "Less tribal knowledge",
      "Measurable time saved",
    ],
  },
];
