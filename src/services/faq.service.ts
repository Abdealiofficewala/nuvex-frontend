import { mockFaqs } from "@/data/mock/faq";
import { axiosClient, withMockFallback } from "@/services/api/axios-client";
import { endpoints } from "@/services/api/endpoints";
import type { FaqItem } from "@/types/faq";

export const faqService = {
  getFaqs() {
    return withMockFallback(async () => {
      const { data } = await axiosClient.get<FaqItem[]>(endpoints.faq);
      return data;
    }, mockFaqs);
  },
};
