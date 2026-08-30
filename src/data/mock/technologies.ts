import type { Technology } from "@/types/technology";

export const mockTechnologies: Technology[] = [
  { id: "tech-next", name: "Next.js", category: "frontend", summary: "App Router sites and product interfaces." },
  { id: "tech-react", name: "React", category: "frontend", summary: "Component systems with a long maintenance horizon." },
  { id: "tech-ts", name: "TypeScript", category: "frontend", summary: "Typed contracts across the stack." },
  { id: "tech-node", name: "Node.js", category: "backend", summary: "APIs and background work in one language family." },
  { id: "tech-express", name: "Express.js", category: "backend", summary: "Focused HTTP services that stay readable." },
  { id: "tech-mongo", name: "MongoDB", category: "data", summary: "Document models when the domain is still moving." },
  { id: "tech-postgres", name: "PostgreSQL", category: "data", summary: "Relational integrity when the rules are firm." },
  { id: "tech-aws", name: "AWS", category: "cloud", summary: "Production hosting, storage, and delivery." },
  { id: "tech-qa", name: "Playwright", category: "quality", summary: "End-to-end checks on the paths that matter." },
];
