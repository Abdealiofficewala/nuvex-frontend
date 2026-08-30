"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AdminConfirmModal, AdminFieldLabel, AdminFormField } from "@/components/admin/common";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { SocialIcon } from "@/components/website/common/SocialIcon";
import { SOCIAL_LINK_FIELDS, type SocialLinkKey, type SocialLinksState } from "@/lib/social-links.config";
import {
  getDefaultSocialLinksState,
  getSocialLinksState,
  resetSocialLinksState,
  saveSocialLinksState,
} from "@/lib/social-links";
import {
  isSocialLinksFormValid,
  touchAllSocialLinkFields,
  validateSocialLinkField,
  validateSocialLinksForm,
  type SocialLinkErrorKey,
} from "@/lib/validations/social-links";
import { cn } from "@/lib/utils";

type ConfirmState =
  | { type: "reset" }
  | { type: "hide"; key: SocialLinkKey; label: string };

export function SocialLinksForm() {
  const t = useTranslations("admin.company.social");
  const toast = useToast();
  const [state, setState] = useState<SocialLinksState>(() => getDefaultSocialLinksState());
  const [touchedFields, setTouchedFields] = useState<Partial<Record<SocialLinkKey, boolean>>>({});
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    setState(getSocialLinksState());
  }, []);

  const fieldErrors = validateSocialLinksForm(state);
  const canSave = isSocialLinksFormValid(fieldErrors);

  function getFieldErrorMessage(errorKey: string) {
    return t(`errors.${errorKey as SocialLinkErrorKey}`);
  }

  function touchField(key: SocialLinkKey) {
    setTouchedFields((current) => ({ ...current, [key]: true }));
  }

  function getVisibleFieldError(key: SocialLinkKey): SocialLinkErrorKey | undefined {
    if (!touchedFields[key]) {
      return undefined;
    }

    return fieldErrors[key];
  }

  function updateLink(key: SocialLinkKey, value: string) {
    touchField(key);
    setState((current) => ({
      ...current,
      links: { ...current.links, [key]: value },
    }));
  }

  function requestVisibilityChange(key: SocialLinkKey, label: string) {
    const visible = state.visibility[key];

    if (visible) {
      setConfirm({ type: "hide", key, label });
      return;
    }

    touchField(key);
    const error = validateSocialLinkField(key, state.links[key], true);

    if (error) {
      return;
    }

    setState((current) => ({
      ...current,
      visibility: { ...current.visibility, [key]: true },
    }));
  }

  function applyHideVisibility(key: SocialLinkKey) {
    setState((current) => ({
      ...current,
      visibility: { ...current.visibility, [key]: false },
    }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouchedFields(touchAllSocialLinkFields());

    if (!canSave) {
      toast.error(t("errors.title"), t("errors.validation"));
      return;
    }

    setSaving(true);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 360));
      saveSocialLinksState(state);
      toast.success(t("success.title"), t("success.body"));
    } catch {
      toast.error(t("errors.title"), t("errors.generic"));
    } finally {
      setSaving(false);
    }
  }

  function requestReset() {
    setConfirm({ type: "reset" });
  }

  async function handleConfirm() {
    if (!confirm) {
      return;
    }

    setConfirmLoading(true);

    try {
      if (confirm.type === "reset") {
        const cleared = resetSocialLinksState();
        setState(cleared);
        setTouchedFields({});
        toast.success(t("reset.title"), t("reset.body"));
      } else {
        applyHideVisibility(confirm.key);
      }

      setConfirm(null);
    } finally {
      setConfirmLoading(false);
    }
  }

  const confirmTitle =
    confirm?.type === "reset"
      ? t("confirmReset.title")
      : confirm?.type === "hide"
        ? t("confirmHide.title", { platform: confirm.label })
        : "";

  const confirmDescription =
    confirm?.type === "reset"
      ? t("confirmReset.description")
      : confirm?.type === "hide"
        ? t("confirmHide.description", { platform: confirm.label })
        : "";

  const confirmLabel =
    confirm?.type === "reset"
      ? t("confirmReset.confirm")
      : confirm?.type === "hide"
        ? t("confirmHide.confirm")
        : undefined;

  return (
    <>
      <form className="admin-social-form admin-create-form" onSubmit={onSubmit} noValidate>
        <div className="admin-panel admin-social-form__panel">
          <div className="admin-social-form__table" role="table">
            <div className="admin-social-form__columns" role="row">
              <span role="columnheader">{t("columns.platform")}</span>
              <span role="columnheader">{t("columns.url")}</span>
              <span role="columnheader">{t("columns.visible")}</span>
            </div>

            <div className="admin-social-form__body">
              {SOCIAL_LINK_FIELDS.map((field) => {
                const visible = state.visibility[field.key];

                return (
                  <div
                    key={field.key}
                    className={cn("admin-social-form__row", !visible && "is-off")}
                    role="row"
                  >
                    <div className="admin-social-form__platform" role="cell">
                      <span className="admin-social-form__platform-icon" aria-hidden="true">
                        <SocialIcon name={field.icon} />
                      </span>
                      <span className="admin-social-form__platform-label">{field.label}</span>
                    </div>

                    <div className="admin-social-form__url" role="cell">
                      <AdminFormField
                        id={`social-link-${field.key}`}
                        label={
                          <span className="sr-only">
                            {field.label} {t("urlLabel")}
                          </span>
                        }
                        required={visible}
                        type="url"
                        value={state.links[field.key]}
                        onChange={(event) => updateLink(field.key, event.target.value)}
                        onBlur={() => touchField(field.key)}
                        placeholder={t(`placeholders.${field.key}`)}
                        disabled={saving}
                        inputMode="url"
                        autoComplete="off"
                        fieldError={getVisibleFieldError(field.key)}
                        getErrorMessage={getFieldErrorMessage}
                        className="admin-social-form__field"
                      />
                    </div>

                    <div className="admin-social-form__visibility" role="cell">
                      <div className="admin-social-form__visibility-field">
                        <AdminFieldLabel htmlFor={`social-visible-${field.key}`} className="sr-only">
                          {t("visibility.switchLabel", { platform: field.label })}
                        </AdminFieldLabel>
                        <button
                          id={`social-visible-${field.key}`}
                          type="button"
                          className={cn("admin-social-form__toggle", visible && "is-on")}
                          role="switch"
                          aria-checked={visible}
                          aria-label={t(visible ? "visibility.hideAction" : "visibility.showAction", {
                            platform: field.label,
                          })}
                          disabled={saving}
                          onClick={() => requestVisibilityChange(field.key, field.label)}
                        >
                          <span className="admin-social-form__toggle-track" aria-hidden="true">
                            <span className="admin-social-form__toggle-thumb" />
                          </span>
                          <span className="admin-social-form__toggle-text">
                            {visible ? t("visibility.show") : t("visibility.hide")}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="admin-page-actions admin-page-actions--form">
            <Button
              type="button"
              variant="secondary"
              className="admin-page-actions__btn admin-page-actions__btn--reset"
              disabled={saving || confirmLoading}
              onClick={requestReset}
            >
              {t("resetAction")}
            </Button>
            <Button
              type="submit"
              variant="accent"
              className="admin-page-actions__btn admin-page-actions__btn--save"
              disabled={!canSave || saving || confirmLoading}
            >
              {saving ? t("saving") : t("save")}
            </Button>
          </div>
        </div>
      </form>

      <AdminConfirmModal
        open={Boolean(confirm)}
        title={confirmTitle}
        description={confirmDescription}
        confirmLabel={confirmLabel}
        tone={confirm?.type === "hide" ? "caution" : "default"}
        loading={confirmLoading}
        onConfirm={handleConfirm}
        onCancel={() => {
          if (!confirmLoading) {
            setConfirm(null);
          }
        }}
      />
    </>
  );
}
