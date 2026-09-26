"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  AdminCheckbox,
  AdminConfirmModal,
  AdminFieldError,
  AdminFieldLabel,
  AdminModal,
} from "@/components/admin/common";
import { SiteTopBarContent } from "@/components/website/common/SiteTopBarContent";
import { Button } from "@/components/ui/buttons";
import { useToast } from "@/components/ui/toast";
import {
  SITE_TOP_BAR_CONTACT_FIELDS,
  SITE_TOP_BAR_MESSAGE_LIMIT,
  type SiteTopBarContactField,
  type SiteTopBarState,
} from "@/lib/site-top-bar.config";
import {
  getEmptySiteTopBarState,
  getSiteTopBarState,
  resetSiteTopBarState,
  resolveSiteTopBarDisplay,
  saveSiteTopBarState,
} from "@/lib/site-top-bar";
import {
  isSiteTopBarFormValid,
  validateSiteTopBarForm,
  type SiteTopBarErrorKey,
  type SiteTopBarField,
} from "@/lib/validations/site-top-bar";
import { cn } from "@/lib/utils";

function DisplayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4.5 12s3.2-5.5 7.5-5.5S19.5 12 19.5 12s-3.2 5.5-7.5 5.5S4.5 12 4.5 12Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6.5 8.5h11M6.5 12h7M6.5 15.5h9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <rect x="4.5" y="5.5" width="15" height="13" rx="2.2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function MessagesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 8h12M6 12h8M6 16h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
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
      <div className="admin-top-bar-form__section-body">{children}</div>
    </section>
  );
}

const CONTACT_SHOW_FIELD: Record<SiteTopBarContactField, keyof SiteTopBarState> = {
  phone: "showPhone",
  email: "showEmail",
  location: "showLocation",
};

const CONTACT_SHOW_LABEL_KEY: Record<
  SiteTopBarContactField,
  "fields.showPhone" | "fields.showEmail" | "fields.showLocation"
> = {
  phone: "fields.showPhone",
  email: "fields.showEmail",
  location: "fields.showLocation",
};

export function TopBarForm() {
  const t = useTranslations("admin.company.topBar");
  const tCommon = useTranslations("common");
  const tModal = useTranslations("admin.common.modal");
  const toast = useToast();
  const [state, setState] = useState<SiteTopBarState>(() => getEmptySiteTopBarState());
  const [touchedFields, setTouchedFields] = useState<Partial<Record<SiteTopBarField, boolean>>>({});
  const [touchedMessageIndexes, setTouchedMessageIndexes] = useState<Partial<Record<number, boolean>>>({});
  const [saving, setSaving] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    setState(getSiteTopBarState());
  }, []);

  const detailLabels = useMemo(
    () => ({
      phone: tCommon("topBar.phone"),
      email: tCommon("topBar.email"),
      location: tCommon("topBar.location"),
    }),
    [tCommon],
  );

  const previewDisplay = useMemo(
    () => resolveSiteTopBarDisplay(state.visible ? state : { ...state, visible: true }, detailLabels),
    [state, detailLabels],
  );

  const fieldErrors = validateSiteTopBarForm(state);
  const canSave = isSiteTopBarFormValid(fieldErrors);

  function getErrorMessage(errorKey: string) {
    return t(`errors.${errorKey as SiteTopBarErrorKey}`);
  }

  function touchField(field: SiteTopBarField) {
    setTouchedFields((current) => ({ ...current, [field]: true }));
  }

  function touchMessageIndex(index: number) {
    setTouchedMessageIndexes((current) => ({ ...current, [index]: true }));
  }

  function getVisibleFieldError(field: SiteTopBarContactField): SiteTopBarErrorKey | undefined {
    if (!touchedFields[field]) {
      return undefined;
    }

    return fieldErrors[field];
  }

  function getVisibleMessageError(index: number): SiteTopBarErrorKey | undefined {
    if (!touchedMessageIndexes[index] && !touchedFields.messages) {
      return undefined;
    }

    return fieldErrors.messages?.[index];
  }

  function updateState(patch: Partial<SiteTopBarState>) {
    setState((current) => ({ ...current, ...patch }));
  }

  function updateContactField(field: SiteTopBarContactField, value: string) {
    touchField(field);
    setState((current) => ({ ...current, [field]: value }));
  }

  function updateShowField(field: SiteTopBarContactField, checked: boolean) {
    setState((current) => ({ ...current, [CONTACT_SHOW_FIELD[field]]: checked }));
  }

  function updateMessage(index: number, value: string) {
    setState((current) => ({
      ...current,
      messages: current.messages.map((line, lineIndex) => (lineIndex === index ? value : line)),
    }));
  }

  function addMessage() {
    setState((current) => {
      if (current.messages.length >= SITE_TOP_BAR_MESSAGE_LIMIT) {
        return current;
      }

      return { ...current, messages: [...current.messages, ""] };
    });
  }

  function removeMessage(index: number) {
    setState((current) => ({
      ...current,
      messages: current.messages.filter((_, lineIndex) => lineIndex !== index),
    }));
    setTouchedMessageIndexes((current) => {
      const next: Partial<Record<number, boolean>> = {};
      Object.entries(current).forEach(([key, value]) => {
        const messageIndex = Number(key);
        if (messageIndex < index) {
          next[messageIndex] = value;
        } else if (messageIndex > index) {
          next[messageIndex - 1] = value;
        }
      });
      return next;
    });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouchedFields({
      phone: true,
      email: true,
      location: true,
      messages: true,
    });
    setTouchedMessageIndexes(
      state.messages.reduce(
        (acc, _, index) => {
          acc[index] = true;
          return acc;
        },
        {} as Partial<Record<number, boolean>>,
      ),
    );

    const submitErrors = validateSiteTopBarForm(state);
    if (!isSiteTopBarFormValid(submitErrors)) {
      toast.error(t("errors.title"), t("errors.validation"));
      return;
    }

    setSaving(true);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 360));
      saveSiteTopBarState(state);
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
      const cleared = resetSiteTopBarState();
      setState(cleared);
      setTouchedFields({});
      setTouchedMessageIndexes({});
      toast.success(t("reset.title"), t("reset.body"));
      setResetOpen(false);
    } finally {
      setResetLoading(false);
    }
  }

  const contactRows = SITE_TOP_BAR_CONTACT_FIELDS.map((field) => ({
    field,
    showKey: CONTACT_SHOW_FIELD[field],
  }));

  return (
    <>
      <form className="admin-contact-form admin-create-form admin-top-bar-form" onSubmit={onSubmit} noValidate>
        <div className="admin-panel admin-contact-form__panel">
          <div className="admin-top-bar-form__sections">
            <FormSection icon={<DisplayIcon />} title={t("sections.visibility.title")}>
              <p className="admin-top-bar-form__lede">{t("sections.visibility.body")}</p>
              <AdminCheckbox
                id="top-bar-visible"
                checked={state.visible}
                label={t("fields.visible")}
                showLabel
                onChange={(checked) => updateState({ visible: checked })}
              />
              <p
                className={cn(
                  "admin-top-bar-form__note",
                  !state.visible && "admin-top-bar-form__note--muted",
                )}
              >
                {state.visible ? t("sections.visibility.requirement") : t("sections.visibility.hiddenNote")}
              </p>
            </FormSection>

            <FormSection icon={<ContactIcon />} title={t("sections.contact.title")}>
              <p className="admin-top-bar-form__lede">{t("sections.contact.body")}</p>
              <div className="admin-top-bar-form__contact-grid">
                {contactRows.map(({ field, showKey }) => {
                  const fieldId = `top-bar-${field}`;
                  const fieldError = getVisibleFieldError(field);
                  const fieldErrorId = `${fieldId}-error`;
                  const fieldErrorMessage = fieldError ? getErrorMessage(fieldError) : null;

                  return (
                    <div
                      key={field}
                      className={cn("admin-top-bar-form__contact-row", fieldError && "is-invalid")}
                    >
                      <AdminCheckbox
                        id={`top-bar-show-${field}`}
                        className="admin-top-bar-form__contact-toggle"
                        checked={Boolean(state[showKey])}
                        label={t(CONTACT_SHOW_LABEL_KEY[field])}
                        showLabel
                        disabled={!state.visible}
                        onChange={(checked) => updateShowField(field, checked)}
                      />
                      <div className="admin-contact-form__field">
                        <AdminFieldLabel htmlFor={fieldId}>{t(`fields.${field}`)}</AdminFieldLabel>
                        <input
                          id={fieldId}
                          value={state[field]}
                          placeholder={t(`placeholders.${field}`)}
                          disabled={!state.visible || !state[showKey] || saving}
                          aria-invalid={fieldError ? true : undefined}
                          aria-describedby={fieldErrorMessage ? fieldErrorId : undefined}
                          onChange={(event) => updateContactField(field, event.target.value)}
                          onBlur={() => touchField(field)}
                        />
                        <AdminFieldError id={fieldErrorId} message={fieldErrorMessage} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </FormSection>

            <FormSection icon={<MessagesIcon />} title={t("sections.messages.title")}>
              <p className="admin-top-bar-form__lede">{t("sections.messages.body")}</p>
              <AdminCheckbox
                id="top-bar-show-messages"
                checked={state.showMessages}
                label={t("fields.showMessages")}
                showLabel
                disabled={!state.visible}
                onChange={(checked) => updateState({ showMessages: checked })}
              />
              <div className="admin-top-bar-form__messages">
                {state.messages.map((line, index) => {
                  const messageId = `top-bar-message-${index}`;
                  const messageError = getVisibleMessageError(index);
                  const messageErrorId = `${messageId}-error`;
                  const messageErrorMessage = messageError ? getErrorMessage(messageError) : null;

                  return (
                    <div
                      key={messageId}
                      className={cn("admin-top-bar-form__message-row", messageError && "is-invalid")}
                    >
                      <AdminFieldLabel htmlFor={messageId}>
                        {t("fields.messageLine", { index: index + 1 })}
                      </AdminFieldLabel>
                      <div className="admin-top-bar-form__message-control">
                        <input
                          id={messageId}
                          className="admin-top-bar-form__message-input"
                          value={line}
                          placeholder={t("placeholders.messageLine")}
                          disabled={!state.visible || !state.showMessages || saving}
                          aria-invalid={messageError ? true : undefined}
                          aria-describedby={messageErrorMessage ? messageErrorId : undefined}
                          onChange={(event) => updateMessage(index, event.target.value)}
                          onBlur={() => touchMessageIndex(index)}
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          className="admin-top-bar-form__message-remove"
                          disabled={!state.visible || !state.showMessages || saving}
                          onClick={() => removeMessage(index)}
                        >
                          {t("removeMessage")}
                        </Button>
                      </div>
                      <AdminFieldError id={messageErrorId} message={messageErrorMessage} />
                    </div>
                  );
                })}
              </div>
              <Button
                type="button"
                variant="secondary"
                className="admin-top-bar-form__message-add"
                disabled={
                  !state.visible ||
                  !state.showMessages ||
                  saving ||
                  state.messages.length >= SITE_TOP_BAR_MESSAGE_LIMIT
                }
                onClick={addMessage}
              >
                {t("addMessage")}
              </Button>
            </FormSection>
          </div>

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
              disabled={!canSave || saving || resetLoading}
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
        <div className="admin-top-bar-form__preview-frame">
          <SiteTopBarContent display={previewDisplay} preview />
        </div>
      </AdminModal>

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
