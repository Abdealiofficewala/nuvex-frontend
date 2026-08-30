import { mockProjects } from "@/data/mock/projects";
import { axiosClient, withMockFallback } from "@/services/api/axios-client";
import type { Project } from "@/types/project";

export const projectsService = {
  getProjects() {
    return withMockFallback(async () => {
      const { data } = await axiosClient.get<Project[]>("/projects");
      return data;
    }, mockProjects);
  },
};
