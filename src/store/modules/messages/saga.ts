import { call, put, takeLatest } from "redux-saga/effects";
import { messagesService } from "@/services/messages.service";
import { messagesActions } from "@/store/modules/messages/slice";

function* submitEnquiryWorker(action: ReturnType<typeof messagesActions.submitEnquiryRequested>) {
  try {
    yield call(messagesService.createMessage, action.payload);
    yield put(messagesActions.submitEnquirySucceeded());
  } catch (error) {
    yield put(
      messagesActions.submitEnquiryFailed(error instanceof Error ? error.message : "Unable to send enquiry"),
    );
  }
}

export function* messagesSaga() {
  yield takeLatest(messagesActions.submitEnquiryRequested.type, submitEnquiryWorker);
}
