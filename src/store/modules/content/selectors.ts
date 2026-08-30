import type { RootState } from "@/store";

export const selectCompany = (state: RootState) => state.content.company;
export const selectTheme = (state: RootState) => state.content.theme;
export const selectIndustries = (state: RootState) => state.content.industries;
export const selectTestimonials = (state: RootState) => state.content.testimonials;
export const selectFaqs = (state: RootState) => state.content.faqs;
