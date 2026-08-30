import { mockIndustries } from "@/data/mock/industries";
import { axiosClient, withMockFallback } from "@/services/api/axios-client";
import { endpoints } from "@/services/api/endpoints";
import type { Industry } from "@/types/industry";

export const industriesService = {
  getIndustries() {
    return withMockFallback(async () => {
      const { data } = await axiosClient.get<Industry[]>(endpoints.industries);
      return data;
    }, mockIndustries);
  },

  async getIndustryBySlug(slug?: string | null) {
    const key = slug?.trim();
    if (!key) {
      return undefined;
    }
    const industries = await industriesService.getIndustries();
    return industries?.find((industry) => industry.slug === key);
  },

  async getRelatedIndustries(slug?: string | null, limit = 3) {
    const key = slug?.trim();
    const industries = await industriesService.getIndustries();
    return (industries ?? []).filter((industry) => industry.slug !== key).slice(0, limit);
  },
};
