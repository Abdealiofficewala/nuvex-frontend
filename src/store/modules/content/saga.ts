import { call, put, takeLatest } from "redux-saga/effects";
import { companyService } from "@/services/company.service";
import { faqService } from "@/services/faq.service";
import { industriesService } from "@/services/industries.service";
import { testimonialsService } from "@/services/testimonials.service";
import { themeService } from "@/services/theme.service";
import { contentActions } from "@/store/modules/content/slice";
import type { Company } from "@/types/company";
import type { FaqItem } from "@/types/faq";
import type { Sector } from "@/types/industry";
import type { Testimonial } from "@/types/testimonial";
import type { ThemeTokens } from "@/types/theme";

function fail(error: unknown) {
  return contentActions.contentFailed(error instanceof Error ? error.message : "Unable to load content");
}

function* fetchCompanyWorker() {
  try {
    const company: Company = yield call(companyService.getCompany);
    yield put(contentActions.fetchCompanySucceeded(company));
  } catch (error) {
    yield put(fail(error));
  }
}

function* fetchThemeWorker() {
  try {
    const theme: ThemeTokens = yield call(themeService.getTheme);
    yield put(contentActions.fetchThemeSucceeded(theme));
  } catch (error) {
    yield put(fail(error));
  }
}

function* fetchIndustriesWorker() {
  try {
    const industries: Sector[] = yield call(industriesService.getIndustries);
    yield put(contentActions.fetchIndustriesSucceeded(industries));
  } catch (error) {
    yield put(fail(error));
  }
}

function* fetchTestimonialsWorker() {
  try {
    const testimonials: Testimonial[] = yield call(testimonialsService.getTestimonials);
    yield put(contentActions.fetchTestimonialsSucceeded(testimonials));
  } catch (error) {
    yield put(fail(error));
  }
}

function* fetchFaqsWorker() {
  try {
    const faqs: FaqItem[] = yield call(faqService.getFaqs);
    yield put(contentActions.fetchFaqsSucceeded(faqs));
  } catch (error) {
    yield put(fail(error));
  }
}

export function* contentSaga() {
  yield takeLatest(contentActions.fetchCompanyRequested.type, fetchCompanyWorker);
  yield takeLatest(contentActions.fetchThemeRequested.type, fetchThemeWorker);
  yield takeLatest(contentActions.fetchIndustriesRequested.type, fetchIndustriesWorker);
  yield takeLatest(contentActions.fetchTestimonialsRequested.type, fetchTestimonialsWorker);
  yield takeLatest(contentActions.fetchFaqsRequested.type, fetchFaqsWorker);
}
