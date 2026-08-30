import { all } from "redux-saga/effects";
import { contentSaga } from "@/store/modules/content/saga";
import { homepageSaga } from "@/store/modules/homepage/saga";
import { messagesSaga } from "@/store/modules/messages/saga";
import { productsSaga } from "@/store/modules/products/saga";

export function* rootSaga() {
  yield all([productsSaga(), homepageSaga(), messagesSaga(), contentSaga()]);
}
