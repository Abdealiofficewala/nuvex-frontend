"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  AdminAccordion,
  AdminConfirmModal,
  AdminFormField,
  AdminMapPreview,
  AdminMapSearchField,
  AdminPhoneField,
} from "@/components/admin/common";
import { Button } from "@/components/ui/buttons";
import { useToast } from "@/components/ui/toast";
import {
  CONTACT_ADDRESS_FIELDS,
  type ContactAddress,
  type ContactDetailsState,
  type ContactPhoneKey,
} from "@/lib/contact-details.config";
import {
  getContactDetailsState,
  getEmptyContactDetailsState,
  resetContactDetailsState,
  resolveContactMapQuery,
  saveContactDetailsState,
} from "@/lib/contact-details";
import {
  isContactDetailsFormValid,
  touchAllContactDetailsFields,
  validateContactDetailsForm,
  type ContactDetailsErrorKey,
  type ContactDetailsField,
} from "@/lib/validations/contact-details";
import { formatPhoneParts } from "@/lib/utils/phone";
import { cn } from "@/lib/utils";

function ContactIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.5 8.5h11M6.5 12h7M6.5 15.5h9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <rect x="4.5" y="5.5" width="15" height="13" rx="2.2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function OfficeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5.5 19.5V8.2l6.5-3.7 6.5 3.7v11.3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9.5 19.5v-5h5v5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function ContactDetailsForm() {
  const t = useTranslations("admin.company.contact");
  const toast = useToast();
  const personId = useId();
  const emailId = useId();
  const [state, setState] = useState<ContactDetailsState>(() => getEmptyContactDetailsState());
  const [touchedFields, setTouchedFields] = useState<Partial<Record<ContactDetailsField, boolean>>>({});
  const [saving, setSaving] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    setState(getContactDetailsState());
  }, []);

  const fieldErrors = validateContactDetailsForm(state);
  const canSave = isContactDetailsFormValid(fieldErrors);
  const mapPreviewQuery = useMemo(() => resolveContactMapQuery(state), [state]);

  function getFieldErrorMessage(errorKey: string) {
    return t(`errors.${errorKey as ContactDetailsErrorKey}`);
  }

  function touchField(field: ContactDetailsField) {
    setTouchedFields((current) => ({ ...current, [field]: true }));
  }

  function getVisibleFieldError(field: ContactDetailsField): ContactDetailsErrorKey | undefined {
    if (!touchedFields[field]) {
      return undefined;
    }

    return fieldErrors[field];
  }

  function updateField(field: "person" | "email" | "mapQuery", value: string) {
    touchField(field);
    setState((current) => ({ ...current, [field]: value }));
  }

  function updatePhone(
    key: ContactPhoneKey,
    patch: Partial<{ countryCode: string; number: string }>,
  ) {
    touchField(key);
    setState((current) => ({
      ...current,
      phones: current.phones.map((item) => {
        if (item.key !== key) {
          return item;
        }

        const countryCode = patch.countryCode ?? item.countryCode;
        const number = patch.number ?? item.number;

        return {
          ...item,
          countryCode,
          number,
          value: formatPhoneParts(countryCode, number),
        };
      }),
    }));
  }

  function updateAddress(field: keyof ContactAddress, value: string) {
    touchField(field);
    setState((current) => ({
      ...current,
      address: { ...current.address, [field]: value },
    }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouchedFields(touchAllContactDetailsFields());

    if (!canSave) {
      toast.error(t("errors.title"), t("errors.validation"));
      return;
    }

    setSaving(true);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 360));
      saveContactDetailsState(state);
      toast.success(t("success.title"), t("success.body"));
    } catch {
      toast.error(t("errors.title"), t("errors.generic"));
    } finally {
      setSaving(false);
    }
  }

  async function handleResetConfirm() {
    setResetLoading(true);

    try {
      const cleared = resetContactDetailsState();
      setState(cleared);
      setTouchedFields({});
      toast.success(t("reset.title"), t("reset.body"));
      setResetOpen(false);
    } finally {
      setResetLoading(false);
    }
  }

  const mobile = state.phones.find((item) => item.key === "mobile");
  const whatsapp = state.phones.find((item) => item.key === "whatsapp");

  const accordionItems = [
    {
      id: "contact",
      title: t("accordion.contact.title"),
      icon: <ContactIcon />,
      content: (
        <div className="admin-contact-form__section-body">
          <div className="admin-contact-form__stack">
            <div className="admin-contact-form__row admin-contact-form__row--split">
              <AdminFormField
                id={personId}
                label={t("fields.person")}
                required
                type="text"
                value={state.person}
                onChange={(event) => updateField("person", event.target.value)}
                onBlur={() => touchField("person")}
                placeholder={t("placeholders.person")}
                disabled={saving}
                autoComplete="name"
                fieldError={getVisibleFieldError("person")}
                getErrorMessage={getFieldErrorMessage}
              />

              <AdminFormField
                id={emailId}
                label={t("fields.email")}
                required
                type="email"
                value={state.email}
                onChange={(event) => updateField("email", event.target.value)}
                onBlur={() => touchField("email")}
                placeholder={t("placeholders.email")}
                disabled={saving}
                autoComplete="email"
                fieldError={getVisibleFieldError("email")}
                getErrorMessage={getFieldErrorMessage}
              />
            </div>

            <div className="admin-contact-form__phone-stack">
              <AdminPhoneField
                id="contact-mobile"
                label={t("fields.mobile")}
                required
                countryCode={mobile?.countryCode ?? "+91"}
                number={mobile?.number ?? ""}
                placeholder={t("placeholders.mobileNumber")}
                disabled={saving}
                error={
                  getVisibleFieldError("mobile")
                    ? getFieldErrorMessage(getVisibleFieldError("mobile")!)
                    : undefined
                }
                onCountryChange={(countryCode) => updatePhone("mobile", { countryCode })}
                onNumberChange={(number) => updatePhone("mobile", { number })}
                onBlur={() => touchField("mobile")}
              />

              <AdminPhoneField
                id="contact-whatsapp"
                label={t("fields.whatsapp")}
                required
                countryCode={whatsapp?.countryCode ?? "+91"}
                number={whatsapp?.number ?? ""}
                placeholder={t("placeholders.whatsappNumber")}
                disabled={saving}
                error={
                  getVisibleFieldError("whatsapp")
                    ? getFieldErrorMessage(getVisibleFieldError("whatsapp")!)
                    : undefined
                }
                onCountryChange={(countryCode) => updatePhone("whatsapp", { countryCode })}
                onNumberChange={(number) => updatePhone("whatsapp", { number })}
                onBlur={() => touchField("whatsapp")}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "office",
      title: t("accordion.office.title"),
      icon: <OfficeIcon />,
      content: (
        <div className="admin-contact-form__section-body">
          <div className="admin-contact-form__stack">
            <div className="admin-contact-form__grid">
              {CONTACT_ADDRESS_FIELDS.map((field) => (
                <AdminFormField
                  key={field.key}
                  id={`contact-${field.key}`}
                  label={t(`fields.${field.key}`)}
                  required={field.key !== "postalCode"}
                  type="text"
                  value={state.address[field.key]}
                  onChange={(event) => updateAddress(field.key, event.target.value)}
                  onBlur={() => touchField(field.key)}
                  placeholder={t(`placeholders.${field.key}`)}
                  disabled={saving}
                  autoComplete={field.key === "street" ? "street-address" : "off"}
                  className={cn(field.key === "street" && "admin-contact-form__field--wide")}
                  fieldError={getVisibleFieldError(field.key)}
                  getErrorMessage={getFieldErrorMessage}
                />
              ))}
            </div>

            <div className="admin-contact-form__map-block">
              <AdminMapSearchField
                id="contact-map-query"
                label={t("fields.mapQuery")}
                required
                value={state.mapQuery}
                placeholder={t("placeholders.mapQuery")}
                disabled={saving}
                loadingText={t("mapSearch.loading")}
                emptyText={t("mapSearch.empty")}
                fieldError={getVisibleFieldError("mapQuery")}
                getErrorMessage={getFieldErrorMessage}
                onChange={(value) => updateField("mapQuery", value)}
                onBlur={() => touchField("mapQuery")}
              />

              <AdminMapPreview
                query={mapPreviewQuery}
                title={t("mapPreview.title")}
                emptyText={t("mapPreview.empty")}
                compact
              />
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <form className="admin-contact-form admin-create-form" onSubmit={onSubmit} noValidate>
        <div className="admin-panel admin-contact-form__panel">
          <AdminAccordion items={accordionItems} defaultOpen={["contact"]} className="admin-contact-form__accordion" />

          <div className="admin-page-actions admin-page-actions--form">
            <Button
              type="button"
              variant="secondary"
              className="admin-page-actions__btn admin-page-actions__btn--reset"
              disabled={saving || resetLoading}
              onClick={() => setResetOpen(true)}
            >
              {t("resetAction")}
            </Button>
            <Button
              type="submit"
              variant="accent"
              className="admin-page-actions__btn admin-page-actions__btn--save"
              disabled={!canSave || saving || resetLoading}
            >
              {saving ? t("saving") : t("save")}
            </Button>
          </div>
        </div>
      </form>

      <AdminConfirmModal
        open={resetOpen}
        title={t("confirmReset.title")}
        description={t("confirmReset.description")}
        confirmLabel={t("confirmReset.confirm")}
        loading={resetLoading}
        onConfirm={handleResetConfirm}
        onCancel={() => {
          if (!resetLoading) {
            setResetOpen(false);
          }
        }}
      />
    </>
  );
}
