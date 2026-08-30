"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "@/components/admin/login/AdminLoginIcons";
import { useToast } from "@/components/ui/toast";
import { ADMIN_AUTH, ROUTES } from "@/lib/constants";
import { setAdminSession } from "@/lib/admin-session";
import { cn } from "@/lib/utils";
import {
  isAdminLoginFormValid,
  validateAdminLoginForm,
  type AdminLoginField,
  type AdminLoginFormErrors,
  type AdminLoginValues,
} from "@/lib/validations/admin-login";

const initialValues: AdminLoginValues = {
  email: "",
  password: "",
};

export function LoginForm() {
  const t = useTranslations("admin.login");
  const router = useRouter();
  const toast = useToast();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<AdminLoginFormErrors>({});
  const [formError, setFormError] = useState<"errors.generic" | "">("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function update(field: AdminLoginField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setFormError("");

    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const nextErrors = validateAdminLoginForm(values);
    setErrors(nextErrors);

    if (!isAdminLoginFormValid(nextErrors)) {
      return;
    }

    setSubmitting(true);

    try {
      await new Promise((resolve) => {
        window.setTimeout(resolve, ADMIN_AUTH.signInDelayMs);
      });

      setAdminSession(values.email.trim());
      toast.success(t("success.title"), t("success.body"));

      await new Promise((resolve) => {
        window.setTimeout(resolve, ADMIN_AUTH.successRedirectMs);
      });

      router.replace(ROUTES.admin.dashboard);
    } catch {
      setFormError("errors.generic");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="admin-login-form" onSubmit={onSubmit} noValidate>
      <label className={cn(errors.email && "is-invalid")}>
        <span>{t("email")}</span>
        <span className="admin-login-form__control">
          <MailIcon className="admin-login-form__icon" />
          <input
            type="email"
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            autoComplete="username"
            inputMode="email"
            placeholder={t("emailPlaceholder")}
            disabled={submitting}
          />
        </span>
        {errors.email ? <span className="admin-login-form__error">{t(errors.email)}</span> : null}
      </label>

      <label className={cn(errors.password && "is-invalid")}>
        <span>{t("password")}</span>
        <span className="admin-login-form__control admin-login-form__control--password">
          <LockIcon className="admin-login-form__icon" />
          <input
            type={showPassword ? "text" : "password"}
            value={values.password}
            onChange={(event) => update("password", event.target.value)}
            autoComplete="current-password"
            placeholder={t("passwordPlaceholder")}
            disabled={submitting}
          />
          <button
            type="button"
            className="admin-login-form__toggle"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? t("hidePassword") : t("showPassword")}
            aria-pressed={showPassword}
            disabled={submitting}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </span>
        {errors.password ? (
          <span className="admin-login-form__error">
            {t(errors.password, { min: ADMIN_AUTH.minPasswordLength })}
          </span>
        ) : null}
      </label>

      {formError ? <p className="admin-login-form__alert">{t(formError)}</p> : null}

      <button type="submit" className="admin-login-form__submit" disabled={submitting}>
        {submitting ? (
          <>
            <span className="admin-login-form__spinner" aria-hidden="true" />
            {t("submitting")}
          </>
        ) : (
          t("submit")
        )}
      </button>
    </form>
  );
}
