import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RequestStatus } from "@/store/modules/status";
import type { CreateContactMessageInput } from "@/types/message";

type MessagesState = {
  status: RequestStatus;
  error: string | null;
};

const initialState: MessagesState = {
  status: "idle",
  error: null,
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    submitEnquiryRequested(state, action: PayloadAction<CreateContactMessageInput>) {
      void action.payload;
      state.status = "loading";
      state.error = null;
    },
    submitEnquirySucceeded(state) {
      state.status = "succeeded";
    },
    submitEnquiryFailed(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    resetEnquiry(state) {
      state.status = "idle";
      state.error = null;
    },
  },
});

export const messagesActions = messagesSlice.actions;
export const messagesReducer = messagesSlice.reducer;
