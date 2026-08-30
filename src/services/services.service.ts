import { mockServices } from "@/data/mock/services";
import { axiosClient, withMockFallback } from "@/services/api/axios-client";
import type { Service } from "@/types/service";

export const servicesService = {
  getServices() {
    return withMockFallback(async () => {
      const { data } = await axiosClient.get<Service[]>("/services");
      return data;
    }, mockServices);
  },
};
