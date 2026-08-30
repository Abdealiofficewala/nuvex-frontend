export type TechnologyCategory =
  | "frontend"
  | "backend"
  | "data"
  | "cloud"
  | "quality";

export type Technology = {
  id: string;
  name: string;
  category: TechnologyCategory;
  summary: string;
};
