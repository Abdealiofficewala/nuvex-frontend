import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RequestStatus } from "@/store/modules/status";
import type { HomepageContent } from "@/types/homepage";

type HomepageState = {
  content: HomepageContent | null;
  status: RequestStatus;
  error: string | null;
};

const initialState: HomepageState = {
  content: null,
  status: "idle",
  error: null,
};

const homepageSlice = createSlice({
  name: "homepage",
  initialState,
  reducers: {
    fetchHomepageRequested(state) {
      state.status = "loading";
      state.error = null;
    },
    fetchHomepageSucceeded(state, action: PayloadAction<HomepageContent>) {
      state.status = "succeeded";
      state.content = action.payload;
    },
    fetchHomepageFailed(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

export const homepageActions = homepageSlice.actions;
export const homepageReducer = homepageSlice.reducer;
