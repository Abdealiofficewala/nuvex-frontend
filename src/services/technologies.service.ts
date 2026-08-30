import { mockTechnologies } from "@/data/mock/technologies";
import { axiosClient, withMockFallback } from "@/services/api/axios-client";
import type { Technology } from "@/types/technology";

export const technologiesService = {
  getTechnologies() {
    return withMockFallback(async () => {
      const { data } = await axiosClient.get<Technology[]>("/technologies");
      return data;
    }, mockTechnologies);
  },
};
