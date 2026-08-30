import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RequestStatus } from "@/store/modules/status";
import type { Company } from "@/types/company";
import type { FaqItem } from "@/types/faq";
import type { Industry } from "@/types/industry";
import type { Testimonial } from "@/types/testimonial";
import type { ThemeTokens } from "@/types/theme";

type ContentState = {
  company: Company | null;
  theme: ThemeTokens | null;
  industries: Industry[];
  testimonials: Testimonial[];
  faqs: FaqItem[];
  status: RequestStatus;
  error: string | null;
};

const initialState: ContentState = {
  company: null,
  theme: null,
  industries: [],
  testimonials: [],
  faqs: [],
  status: "idle",
  error: null,
};

const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    fetchCompanyRequested(state) {
      state.status = "loading";
    },
    fetchCompanySucceeded(state, action: PayloadAction<Company>) {
      state.status = "succeeded";
      state.company = action.payload;
    },
    fetchThemeRequested(state) {
      state.status = "loading";
    },
    fetchThemeSucceeded(state, action: PayloadAction<ThemeTokens>) {
      state.status = "succeeded";
      state.theme = action.payload;
    },
    fetchIndustriesRequested(state) {
      state.status = "loading";
    },
    fetchIndustriesSucceeded(state, action: PayloadAction<Industry[]>) {
      state.status = "succeeded";
      state.industries = action.payload;
    },
    fetchTestimonialsRequested(state) {
      state.status = "loading";
    },
    fetchTestimonialsSucceeded(state, action: PayloadAction<Testimonial[]>) {
      state.status = "succeeded";
      state.testimonials = action.payload;
    },
    fetchFaqsRequested(state) {
      state.status = "loading";
    },
    fetchFaqsSucceeded(state, action: PayloadAction<FaqItem[]>) {
      state.status = "succeeded";
      state.faqs = action.payload;
    },
    contentFailed(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

export const contentActions = contentSlice.actions;
export const contentReducer = contentSlice.reducer;
