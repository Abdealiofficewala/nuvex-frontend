import { call, put, takeLatest } from "redux-saga/effects";
import { homepageService } from "@/services/homepage.service";
import { homepageActions } from "@/store/modules/homepage/slice";
import type { HomepageContent } from "@/types/homepage";

function* fetchHomepageWorker() {
  try {
    const content: HomepageContent = yield call(homepageService.getHomepage);
    yield put(homepageActions.fetchHomepageSucceeded(content));
  } catch (error) {
    yield put(homepageActions.fetchHomepageFailed(error instanceof Error ? error.message : "Unable to load homepage"));
  }
}

export function* homepageSaga() {
  yield takeLatest(homepageActions.fetchHomepageRequested.type, fetchHomepageWorker);
}
