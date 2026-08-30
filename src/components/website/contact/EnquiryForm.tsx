"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { isContactFormValid, validateContactForm } from "@/lib/validations/contact";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { messagesActions } from "@/store/modules/messages/slice";
import { selectEnquiryError, selectEnquiryStatus } from "@/store/modules/messages/selectors";
import type { ContactFormErrors } from "@/lib/validations/contact";
import type { CreateContactMessageInput } from "@/types/message";

const initialValues: CreateContactMessageInput = {
  name: "",
  email: "",
  phone: "",
  company: "",
  message: "",
};

export function EnquiryForm() {
  const t = useTranslations("contact");
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectEnquiryStatus);
  const error = useAppSelector(selectEnquiryError);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<ContactFormErrors>({});

  useEffect(() => {
    return () => {
      dispatch(messagesActions.resetEnquiry());
    };
  }, [dispatch]);

  function update<K extends keyof CreateContactMessageInput>(key: K, value: CreateContactMessageInput[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateContactForm(values);
    setErrors(nextErrors);
    if (!isContactFormValid(nextErrors)) {
      return;
    }
    dispatch(messagesActions.submitEnquiryRequested(values));
    setValues(initialValues);
  }

  return (
    <form className={cn("form", "form--split")} onSubmit={onSubmit} noValidate>
      <label>
        {t("form.name")}
        <input value={values.name} onChange={(event) => update("name", event.target.value)} autoComplete="name" />
        {errors.name ? <span className={"form__error"}>{t(errors.name)}</span> : null}
      </label>
      <label>
        {t("form.email")}
        <input type="email" value={values.email} onChange={(event) => update("email", event.target.value)} autoComplete="email" />
        {errors.email ? <span className={"form__error"}>{t(errors.email)}</span> : null}
      </label>
      <label>
        {t("form.phone")}
        <input value={values.phone ?? ""} onChange={(event) => update("phone", event.target.value)} autoComplete="tel" />
      </label>
      <label>
        {t("form.company")}
        <input value={values.company ?? ""} onChange={(event) => update("company", event.target.value)} autoComplete="organization" />
      </label>
      <label className={cn("form__full", "form__message")}>
        {t("form.message")}
        <textarea value={values.message} onChange={(event) => update("message", event.target.value)} />
        {errors.message ? <span className={"form__error"}>{t(errors.message)}</span> : null}
      </label>
      {status === "succeeded" ? <p className={cn("form__status", "is-success", "form__full")}>{t("form.success")}</p> : null}
      {status === "failed" ? <p className={cn("form__error", "form__full")}>{error ?? t("form.error")}</p> : null}
      <div className={"form__full"}>
        <Button type="submit" variant="accent" disabled={status === "loading"}>
          {t("form.submit")}
        </Button>
      </div>
    </form>
  );
}
