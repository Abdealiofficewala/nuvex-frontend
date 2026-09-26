"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  AdminConfirmModal,
  AdminFormField,
  AdminFormTextarea,
  AdminModal,
  AdminPhoneField,
} from "@/components/admin/common";
import { Button } from "@/components/ui/buttons";
import { useToast } from "@/components/ui/toast";
import { CompanyFactsTicket } from "@/components/website/about/CompanyFactsTicket";
import {
  type CompanyProfileField,
  type CompanyProfileState,
} from "@/lib/company-profile.config";
import {
  getCompanyProfileState,
  getEmptyCompanyProfileState,
  resetCompanyProfileState,
  saveCompanyProfileState,
  touchAllCompanyProfileFields,
} from "@/lib/company-profile";
import {
  isCompanyProfileFormValid,
  validateCompanyProfileForm,
  type CompanyProfileErrorKey,
} from "@/lib/validations/company-profile";
import { formatPhoneParts, parsePhoneParts } from "@/lib/utils/phone";

function IdentityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.5 19.5V8.2l6.5-3.7 6.5 3.7v11.3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9.5 19.5v-5h5v5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function FactsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 5.5h10M7 9.5h10M7 13.5h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function PreviewIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3.5 12s3.2-6 8.5-6 8.5 6 8.5 6-3.2 6-8.5 6-8.5-6-8.5-6Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

type FormSectionProps = {
  icon: ReactNode;
  title: string;
  children: ReactNode;
};

function FormSection({ icon, title, children }: FormSectionProps) {
  return (
    <section className="admin-form-section">
      <header className="admin-form-section__head">
        <span className="admin-form-section__icon">{icon}</span>
        <h2 className="admin-form-section__title">{title}</h2>
      </header>
      {children}
    </section>
  );
}

export function CompanyProfileForm() {
  const t = useTranslations("admin.company.profile");
  const tAbout = useTranslations("about");
  const tModal = useTranslations("admin.common.modal");
  const toast = useToast();
  const [state, setState] = useState<CompanyProfileState>(() => getEmptyCompanyProfileState());
  const [touchedFields, setTouchedFields] = useState<Partial<Record<CompanyProfileField, boolean>>>({});
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    setState(getCompanyProfileState());
  }, []);

  const fieldErrors = validateCompanyProfileForm(state);
  const canSave = isCompanyProfileFormValid(fieldErrors);

  const factLabels = useMemo(
    () => ({
      eyebrow: tAbout("facts.eyebrow"),
      title: tAbout("facts.title"),
      legal: tAbout("facts.legal"),
      founded: tAbout("facts.founded"),
      hq: tAbout("facts.hq"),
      desk: tAbout("facts.desk"),
      lines: tAbout("facts.lines"),
      reach: tAbout("facts.reach"),
      enquiries: tAbout("facts.enquiries"),
      phone: tAbout("facts.phone"),
    }),
    [tAbout],
  );

  const phoneParts = useMemo(() => parsePhoneParts(state.phone), [state.phone]);

  function getFieldErrorMessage(errorKey: string) {
    return t(`errors.${errorKey as CompanyProfileErrorKey}`);
  }

  function touchField(field: CompanyProfileField) {
    setTouchedFields((current) => ({ ...current, [field]: true }));
  }

  function getVisibleFieldError(field: CompanyProfileField): CompanyProfileErrorKey | undefined {
    if (!touchedFields[field]) {
      return undefined;
    }

    return fieldErrors[field];
  }

  function updateField(field: CompanyProfileField, value: string) {
    touchField(field);
    setState((current) => ({ ...current, [field]: value }));
  }

  function updateFoundedYear(value: string) {
    touchField("foundedYear");
    setState((current) => ({ ...current, foundedYear: value.replace(/[^\d]/g, "").slice(0, 4) }));
  }

  function updatePhone(patch: Partial<{ countryCode: string; number: string }>) {
    touchField("phone");
    const current = parsePhoneParts(state.phone);
    const countryCode = patch.countryCode ?? current.countryCode;
    const number = patch.number ?? current.number;

    setState((prev) => ({
      ...prev,
      phone: formatPhoneParts(countryCode, number),
    }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouchedFields(touchAllCompanyProfileFields());

    const submitErrors = validateCompanyProfileForm(state);
    if (!isCompanyProfileFormValid(submitErrors)) {
      toast.error(t("errors.title"), t("errors.validation"));
      return;
    }

    setSaving(true);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 360));
      saveCompanyProfileState(state);
      toast.success(t("success.title"), t("success.body"));
    } catch {
      toast.error(t("errors.title"), t("errors.generic"));
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    setResetLoading(true);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 240));
      const nextState = resetCompanyProfileState();
      setState(nextState);
      setTouchedFields({});
      toast.success(t("reset.title"), t("reset.body"));
    } catch {
      toast.error(t("errors.title"), t("errors.generic"));
    } finally {
      setResetLoading(false);
      setResetOpen(false);
    }
  }

  return (
    <>
      <form className="admin-contact-form admin-create-form admin-company-profile-form" onSubmit={onSubmit} noValidate>
        <div className="admin-panel admin-contact-form__panel">
          <div className="admin-company-profile__sections">
            <FormSection icon={<IdentityIcon />} title={t("accordion.identity.title")}>
              <div className="admin-form-grid admin-form-grid--3 admin-company-profile__grid">
                <AdminFormField
                  id="company-profile-name"
                  label={t("fields.name")}
                  required
                  value={state.name}
                  placeholder={t("placeholders.name")}
                  fieldError={getVisibleFieldError("name")}
                  getErrorMessage={getFieldErrorMessage}
                  onChange={(event) => updateField("name", event.target.value)}
                  onBlur={() => touchField("name")}
                />
                <AdminFormField
                  id="company-profile-short-name"
                  label={t("fields.shortName")}
                  required
                  value={state.shortName}
                  placeholder={t("placeholders.shortName")}
                  fieldError={getVisibleFieldError("shortName")}
                  getErrorMessage={getFieldErrorMessage}
                  onChange={(event) => updateField("shortName", event.target.value)}
                  onBlur={() => touchField("shortName")}
                />
                <AdminFormField
                  id="company-profile-founded-year"
                  label={t("fields.foundedYear")}
                  required
                  inputMode="numeric"
                  value={state.foundedYear}
                  placeholder={t("placeholders.foundedYear")}
                  fieldError={getVisibleFieldError("foundedYear")}
                  getErrorMessage={getFieldErrorMessage}
                  onChange={(event) => updateFoundedYear(event.target.value)}
                  onBlur={() => touchField("foundedYear")}
                />
                <div className="admin-form-grid__full">
                  <AdminFormField
                    id="company-profile-tagline"
                    label={t("fields.tagline")}
                    required
                    value={state.tagline}
                    placeholder={t("placeholders.tagline")}
                    fieldError={getVisibleFieldError("tagline")}
                    getErrorMessage={getFieldErrorMessage}
                    onChange={(event) => updateField("tagline", event.target.value)}
                    onBlur={() => touchField("tagline")}
                  />
                </div>
                <div className="admin-form-grid__full">
                  <AdminFormTextarea
                    id="company-profile-description"
                    label={t("fields.description")}
                    required
                    rows={3}
                    value={state.description}
                    placeholder={t("placeholders.description")}
                    fieldError={getVisibleFieldError("description")}
                    getErrorMessage={getFieldErrorMessage}
                    onChange={(event) => updateField("description", event.target.value)}
                    onBlur={() => touchField("description")}
                  />
                </div>
              </div>
            </FormSection>

            <FormSection icon={<FactsIcon />} title={t("accordion.facts.title")}>
              <div className="admin-form-grid admin-form-grid--3 admin-company-profile__grid">
                <AdminFormField
                  id="company-profile-hq-city"
                  label={t("fields.hqCity")}
                  required
                  value={state.hqCity}
                  placeholder={t("placeholders.hqCity")}
                  fieldError={getVisibleFieldError("hqCity")}
                  getErrorMessage={getFieldErrorMessage}
                  onChange={(event) => updateField("hqCity", event.target.value)}
                  onBlur={() => touchField("hqCity")}
                />
                <AdminFormField
                  id="company-profile-hq-state"
                  label={t("fields.hqState")}
                  required
                  value={state.hqState}
                  placeholder={t("placeholders.hqState")}
                  fieldError={getVisibleFieldError("hqState")}
                  getErrorMessage={getFieldErrorMessage}
                  onChange={(event) => updateField("hqState", event.target.value)}
                  onBlur={() => touchField("hqState")}
                />
                <AdminFormField
                  id="company-profile-hq-country"
                  label={t("fields.hqCountry")}
                  required
                  value={state.hqCountry}
                  placeholder={t("placeholders.hqCountry")}
                  fieldError={getVisibleFieldError("hqCountry")}
                  getErrorMessage={getFieldErrorMessage}
                  onChange={(event) => updateField("hqCountry", event.target.value)}
                  onBlur={() => touchField("hqCountry")}
                />
                <div className="admin-form-grid__full admin-company-profile__pair-row">
                  <AdminFormField
                    id="company-profile-product-lines"
                    label={t("fields.productLines")}
                    required
                    value={state.productLines}
                    placeholder={t("placeholders.productLines")}
                    fieldError={getVisibleFieldError("productLines")}
                    getErrorMessage={getFieldErrorMessage}
                    onChange={(event) => updateField("productLines", event.target.value)}
                    onBlur={() => touchField("productLines")}
                  />
                  <AdminFormField
                    id="company-profile-reach"
                    label={t("fields.reach")}
                    required
                    value={state.reach}
                    placeholder={t("placeholders.reach")}
                    fieldError={getVisibleFieldError("reach")}
                    getErrorMessage={getFieldErrorMessage}
                    onChange={(event) => updateField("reach", event.target.value)}
                    onBlur={() => touchField("reach")}
                  />
                </div>
                <div className="admin-form-grid__full admin-company-profile__contact-row">
                  <AdminFormField
                    id="company-profile-email"
                    label={t("fields.email")}
                    required
                    type="email"
                    autoComplete="email"
                    value={state.email}
                    placeholder={t("placeholders.email")}
                    fieldError={getVisibleFieldError("email")}
                    getErrorMessage={getFieldErrorMessage}
                    onChange={(event) => updateField("email", event.target.value)}
                    onBlur={() => touchField("email")}
                  />
                  <AdminPhoneField
                    id="company-profile-phone"
                    label={t("fields.phone")}
                    countryCode={phoneParts.countryCode}
                    number={phoneParts.number}
                    placeholder={t("placeholders.phoneNumber")}
                    disabled={saving}
                    error={
                      getVisibleFieldError("phone")
                        ? getFieldErrorMessage(getVisibleFieldError("phone")!)
                        : undefined
                    }
                    onCountryChange={(countryCode) => updatePhone({ countryCode })}
                    onNumberChange={(number) => updatePhone({ number })}
                    onBlur={() => touchField("phone")}
                  />
                </div>
                <div className="admin-form-grid__full">
                  <AdminFormTextarea
                    id="company-profile-desk-address"
                    label={t("fields.deskAddress")}
                    required
                    rows={2}
                    value={state.deskAddress}
                    placeholder={t("placeholders.deskAddress")}
                    fieldError={getVisibleFieldError("deskAddress")}
                    getErrorMessage={getFieldErrorMessage}
                    onChange={(event) => updateField("deskAddress", event.target.value)}
                    onBlur={() => touchField("deskAddress")}
                  />
                </div>
              </div>
            </FormSection>
          </div>

          <div className="admin-page-actions admin-page-actions--form">
            <Button
              type="button"
              variant="secondary"
              className="admin-page-actions__btn admin-page-actions__btn--reset"
              onClick={() => setResetOpen(true)}
              disabled={saving || resetLoading}
            >
              {t("resetAction")}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="admin-page-actions__btn admin-page-actions__btn--preview"
              onClick={() => setPreviewOpen(true)}
            >
              <PreviewIcon />
              {t("previewAction")}
            </Button>
            <Button
              type="submit"
              variant="accent"
              className="admin-page-actions__btn admin-page-actions__btn--save"
              disabled={!canSave || saving}
            >
              {saving ? t("saving") : t("save")}
            </Button>
          </div>
        </div>
      </form>

      <AdminModal
        open={previewOpen}
        title={t("preview.title")}
        icon="preview"
        simple
        cancelLabel={tModal("cancel")}
        onClose={() => setPreviewOpen(false)}
      >
        <div className="admin-company-profile__preview-frame">
          <CompanyFactsTicket profile={state} factLabels={factLabels} />
        </div>
      </AdminModal>

      <AdminConfirmModal
        open={resetOpen}
        title={t("confirmReset.title")}
        description={t("confirmReset.description")}
        confirmLabel={t("confirmReset.confirm")}
        loading={resetLoading}
        onConfirm={handleReset}
        onCancel={() => setResetOpen(false)}
      />
    </>
  );
}
