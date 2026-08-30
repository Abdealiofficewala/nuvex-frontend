import type { RootState } from "@/store";

export const selectEnquiryStatus = (state: RootState) => state.messages.status;
export const selectEnquiryError = (state: RootState) => state.messages.error;
