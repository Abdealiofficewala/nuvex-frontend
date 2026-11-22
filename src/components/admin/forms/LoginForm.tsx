"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "@/components/admin/login/AdminLoginIcons";
import { AdminFieldError } from "@/components/admin/common/AdminFieldError";
import { AdminFieldLabel } from "@/components/admin/common/AdminFieldLabel";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/buttons";
import { ADMIN_AUTH, ROUTES } from "@/lib/constants";
import { ensureAdminUserForEmail } from "@/lib/admin-users";
import { setAdminSession } from "@/lib/admin-session";
import { cn } from "@/lib/utils";
import {
  isAdminLoginFormValid,
  validateAdminLoginForm,
  verifyAdminCredentials,
  type AdminLoginField,
  type AdminLoginFormErrors,
  type AdminLoginValues,
} from "@/lib/validations/admin-login";

const initialValues: AdminLoginValues = {
  email: "",
  password: "",
};

const EMAIL_FIELD_ID = "admin-login-email";
const PASSWORD_FIELD_ID = "admin-login-password";
const EMAIL_ERROR_ID = "admin-login-email-error";
const PASSWORD_ERROR_ID = "admin-login-password-error";

export function LoginForm() {
  const t = useTranslations("admin.login");
  const router = useRouter();
  const toast = useToast();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<AdminLoginFormErrors>({});
  const [formError, setFormError] = useState<"errors.generic" | "errors.invalidCredentials" | "">("");
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

      if (!verifyAdminCredentials(values)) {
        setFormError("errors.invalidCredentials");
        return;
      }

      const email = values.email.trim();
      setAdminSession(email);
      ensureAdminUserForEmail(email);
      toast.success(t("success.title"), t("success.body"));
      setValues(initialValues);
      window.setTimeout(() => {
        router.replace(ROUTES.admin.dashboard);
      }, ADMIN_AUTH.successRedirectMs);
    } catch {
      setFormError("errors.generic");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="admin-login-form" onSubmit={onSubmit} noValidate>
      <div className={cn("admin-login-form__field", errors.email && "is-invalid")}>
        <AdminFieldLabel htmlFor={EMAIL_FIELD_ID}>{t("email")}</AdminFieldLabel>
        <span className="admin-login-form__control">
          <MailIcon className="admin-login-form__icon" aria-hidden="true" />
          <input
            id={EMAIL_FIELD_ID}
            type="email"
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            autoComplete="username"
            inputMode="email"
            placeholder={t("emailPlaceholder")}
            disabled={submitting}
            aria-invalid={Boolean(errors.email) || undefined}
            aria-describedby={EMAIL_ERROR_ID}
          />
        </span>
        <AdminFieldError
          id={EMAIL_ERROR_ID}
          message={errors.email ? t(errors.email) : null}
          reserveSpace={false}
        />
      </div>

      <div className={cn("admin-login-form__field", errors.password && "is-invalid")}>
        <AdminFieldLabel htmlFor={PASSWORD_FIELD_ID}>{t("password")}</AdminFieldLabel>
        <span className="admin-login-form__control admin-login-form__control--password">
          <LockIcon className="admin-login-form__icon" aria-hidden="true" />
          <input
            id={PASSWORD_FIELD_ID}
            type={showPassword ? "text" : "password"}
            value={values.password}
            onChange={(event) => update("password", event.target.value)}
            autoComplete="current-password"
            placeholder={t("passwordPlaceholder")}
            disabled={submitting}
            aria-invalid={Boolean(errors.password) || undefined}
            aria-describedby={PASSWORD_ERROR_ID}
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
        <AdminFieldError
          id={PASSWORD_ERROR_ID}
          message={
            errors.password ? t(errors.password, { min: ADMIN_AUTH.minPasswordLength }) : null
          }
          reserveSpace={false}
        />
      </div>

      {formError ? (
        <p className="admin-login-form__alert" role="alert">
          {t(formError)}
        </p>
      ) : null}

      <Button
        type="submit"
        variant="accent"
        className="admin-login-form__submit"
        disabled={submitting}
      >
        {submitting ? (
          <>
            <span className="admin-login-form__spinner" aria-hidden="true" />
            {t("submitting")}
          </>
        ) : (
          t("submit")
        )}
      </Button>
    </form>
  );
}
