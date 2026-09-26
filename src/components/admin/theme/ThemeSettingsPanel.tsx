"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/buttons";
import { useToast } from "@/components/ui/toast";
import {
  ADMIN_THEME_COLOR_GROUPS,
  ADMIN_THEME_LOGO_FIELDS,
  ADMIN_THEME_RADIUS_FIELDS,
  getThemeColorLabelKey,
  type AdminThemeColorKey,
  type AdminThemeLogoKey,
} from "@/lib/admin-theme.config";
import {
  getAdminThemeDraft,
  getDefaultAdminTheme,
  resetAdminThemeDraft,
  saveAdminThemeDraft,
  type AdminThemeDraft,
} from "@/lib/admin-theme";
import { themeToCssVars } from "@/lib/theme";
import { cn } from "@/lib/utils";

function normalizeHex(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "#000000";
  }

  return trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
}

export function ThemeSettingsPanel() {
  const t = useTranslations("admin.theme");
  const toast = useToast();
  const [draft, setDraft] = useState<AdminThemeDraft>(() => getDefaultAdminTheme());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(getAdminThemeDraft());
  }, []);

  const previewStyle = useMemo(
    () =>
      themeToCssVars({
        colors: draft.colors,
        fonts: draft.fonts,
        radius: draft.radius,
      }),
    [draft.colors, draft.fonts, draft.radius],
  );

  function updateLogo(key: AdminThemeLogoKey, value: string) {
    setDraft((current) => ({
      ...current,
      branding: { ...current.branding, [key]: value },
    }));
  }

  function updateColor(key: AdminThemeColorKey, value: string) {
    setDraft((current) => ({
      ...current,
      colors: { ...current.colors, [key]: normalizeHex(value) },
    }));
  }

  function updateRadius(key: "sm" | "md" | "lg", value: string) {
    setDraft((current) => ({
      ...current,
      radius: { ...current.radius, [key]: value },
    }));
  }

  async function onSave(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 360));
      saveAdminThemeDraft(draft);
      toast.success(t("success.title"), t("success.body"));
    } catch {
      toast.error(t("errors.title"), t("errors.generic"));
    } finally {
      setSaving(false);
    }
  }

  function onReset() {
    const defaults = resetAdminThemeDraft();
    setDraft(defaults);
    toast.success(t("reset.title"), t("reset.body"));
  }

  return (
    <form className="admin-theme" onSubmit={onSave}>
      <div className="admin-theme__layout">
        <div className="admin-theme__main">
          <section className="admin-theme__section">
            <header className="admin-theme__section-head">
              <h2>{t("sections.logos")}</h2>
              <p>{t("sections.logosHint")}</p>
            </header>

            <div className="admin-theme__logo-grid">
              {ADMIN_THEME_LOGO_FIELDS.map((field) => {
                const src = draft.branding[field.key];
                const previewBg =
                  field.previewVariant === "dark"
                    ? draft.colors.graphite
                    : field.previewVariant === "light"
                      ? draft.colors.background
                      : draft.colors.surface;

                return (
                  <div key={field.key} className="admin-theme__logo-card">
                    <div
                      className="admin-theme__logo-preview"
                      style={{ background: previewBg }}
                    >
                      {src ? (
                        <Image
                          src={src}
                          alt={t(field.labelKey)}
                          width={field.key === "favicon" ? 28 : field.key === "mobileLogo" ? 36 : 120}
                          height={field.key === "favicon" ? 28 : field.key === "mobileLogo" ? 36 : 32}
                          style={{
                            width: "auto",
                            height: field.key === "favicon" ? 28 : field.key === "mobileLogo" ? 36 : 32,
                          }}
                          unoptimized
                        />
                      ) : (
                        <span className="admin-theme__logo-empty">{t("logoEmpty")}</span>
                      )}
                    </div>

                    <label className="admin-theme__field">
                      <span>{t(field.labelKey)}</span>
                      <input
                        type="text"
                        value={src}
                        onChange={(event) => updateLogo(field.key, event.target.value)}
                        placeholder={t("logoPlaceholder")}
                        disabled={saving}
                      />
                    </label>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="admin-theme__section">
            <header className="admin-theme__section-head">
              <h2>{t("sections.colors")}</h2>
              <p>{t("sections.colorsHint")}</p>
            </header>

            {ADMIN_THEME_COLOR_GROUPS.map((group) => (
              <div key={group.group} className="admin-theme__color-group">
                <h3>{t(group.labelKey)}</h3>
                <div className="admin-theme__color-grid">
                  {group.keys.map((key) => (
                    <label key={key} className="admin-theme__color-field">
                      <span>{t(getThemeColorLabelKey(key))}</span>
                      <span className="admin-theme__color-input">
                        <input
                          type="color"
                          value={normalizeHex(draft.colors[key])}
                          onChange={(event) => updateColor(key, event.target.value)}
                          disabled={saving}
                          aria-label={t(getThemeColorLabelKey(key))}
                        />
                        <input
                          type="text"
                          value={draft.colors[key]}
                          onChange={(event) => updateColor(key, event.target.value)}
                          disabled={saving}
                          spellCheck={false}
                        />
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </section>

          <section className="admin-theme__section">
            <header className="admin-theme__section-head">
              <h2>{t("sections.radius")}</h2>
              <p>{t("sections.radiusHint")}</p>
            </header>

            <div className="admin-theme__field-grid admin-theme__field-grid--3">
              {ADMIN_THEME_RADIUS_FIELDS.map((field) => (
                <label key={field.key} className="admin-theme__field">
                  <span>{t(field.labelKey)}</span>
                  <input
                    type="text"
                    value={draft.radius[field.key]}
                    onChange={(event) => updateRadius(field.key, event.target.value)}
                    disabled={saving}
                  />
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="admin-theme__preview" style={previewStyle}>
          <div className="admin-theme__preview-card">
            <p className="admin-theme__preview-kicker">{t("preview.kicker")}</p>
            <div className="admin-theme__preview-logo">
              {draft.branding.logo ? (
                <Image
                  src={draft.branding.logo}
                  alt=""
                  width={140}
                  height={36}
                  style={{ width: "auto", height: 32 }}
                  unoptimized
                />
              ) : null}
            </div>
            <h3>{t("preview.title")}</h3>
            <p>{t("preview.body")}</p>
            <div className="admin-theme__preview-swatches">
              {(["primary", "accent", "background", "surface", "text"] as const).map((key) => (
                <span key={key} className="admin-theme__swatch">
                  <i style={{ background: draft.colors[key] }} />
                  <small>{t(getThemeColorLabelKey(key))}</small>
                </span>
              ))}
            </div>
            <div className="admin-theme__preview-actions">
              <span className="admin-theme__preview-btn admin-theme__preview-btn--primary">
                {t("preview.primaryBtn")}
              </span>
              <span className="admin-theme__preview-btn admin-theme__preview-btn--accent">
                {t("preview.accentBtn")}
              </span>
            </div>
            <div
              className="admin-theme__preview-radius"
              style={{ borderRadius: draft.radius.md }}
            >
              {t("preview.radiusLabel", { value: draft.radius.md })}
            </div>
          </div>
        </aside>
      </div>

      <div className={cn("admin-theme__actions")}>
        <Button type="button" variant="secondary" onClick={onReset} disabled={saving}>
          {t("resetAction")}
        </Button>
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? t("saving") : t("save")}
        </Button>
      </div>
    </form>
  );
}
