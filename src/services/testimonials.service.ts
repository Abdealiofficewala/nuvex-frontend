import { mockTestimonials } from "@/data/mock/testimonials";
import { axiosClient, withMockFallback } from "@/services/api/axios-client";
import { endpoints } from "@/services/api/endpoints";
import type { Testimonial } from "@/types/testimonial";

export const testimonialsService = {
  getTestimonials() {
    return withMockFallback(async () => {
      const { data } = await axiosClient.get<Testimonial[]>(endpoints.testimonials);
      return data;
    }, mockTestimonials);
  },
};
