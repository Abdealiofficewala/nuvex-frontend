import type { ContentStatus } from "@/types/content-admin";

export type Industry = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  image: string;
  status: ContentStatus;
  sortOrder?: number;
};

export type Sector = {
  id: string;
  industryId: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  image: string;
  applications: string[];
  status: ContentStatus;
  sortOrder?: number;
};

export type SectorWithIndustry = Sector & {
  industryName: string;
  industrySlug: string;
};
