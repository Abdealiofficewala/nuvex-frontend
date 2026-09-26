"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { AdminFormField, AdminFormImageUpload } from "@/components/admin/common";
import { Button } from "@/components/ui/buttons";
import { useToast } from "@/components/ui/toast";
import { normalizeSlug } from "@/lib/appearance/slug";
import { ROUTES } from "@/lib/constants";
import { appearanceService } from "@/services/appearance.service";
import type { BrandingInput, BrandingRecord } from "@/types/appearance";

type BrandingFormProps = {
  mode: "create" | "edit";
  initial?: BrandingRecord;
  embedded?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
};

const BRANDING_IMAGE_FIELDS = ["logo", "logoLight", "logoDark", "mobileLogo", "favicon"] as const;

export function BrandingForm({ mode, initial, onSuccess, onCancel }: BrandingFormProps) {
  const t = useTranslations("admin.appearance.brandingForm");
  const toast = useToast();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(() => ({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    logo: initial?.logo ?? "",
    logoDark: initial?.logoDark ?? "",
    logoLight: initial?.logoLight ?? "",
    mobileLogo: initial?.mobileLogo ?? "",
    favicon: initial?.favicon ?? "",
  }));

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);

    const trimmedName = form.name.trim();
    const payload: BrandingInput = {
      name: trimmedName,
      slug: normalizeSlug(form.slug || trimmedName),
      logo: form.logo,
      logoDark: form.logoDark,
      logoLight: form.logoLight,
      mobileLogo: form.mobileLogo,
      favicon: form.favicon,
      applicationName: trimmedName,
      brandName: trimmedName,
    };

    try {
      if (mode === "create") {
        await appearanceService.createBranding(payload);
        toast.success(t("success.createTitle"), t("success.createBody"));
      } else if (initial) {
        await appearanceService.updateBranding(initial.id, payload);
        toast.success(t("success.updateTitle"), t("success.updateBody"));
      }

      onSuccess?.();
      if (!onSuccess) {
        router.push(ROUTES.admin.theme.logos);
      }
    } catch (error) {
      toast.error(t("errors.title"), error instanceof Error ? error.message : t("errors.generic"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="appearance-resource-form admin-create-form" onSubmit={onSubmit}>
      <div className="admin-form-grid admin-form-grid--2">
        <AdminFormField
          id="branding-name"
          label={t("fields.name")}
          required
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          disabled={saving}
        />
        <AdminFormField
          id="branding-slug"
          label={t("fields.slug")}
          value={form.slug}
          onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
          disabled={saving}
        />
      </div>

      <section className="appearance-branding-uploads" aria-labelledby="branding-uploads-heading">
        <h2 id="branding-uploads-heading" className="appearance-branding-uploads__heading">
          {t("sections.assets")}
        </h2>
        <div className="appearance-branding-uploads__grid">
          {BRANDING_IMAGE_FIELDS.map((key) => (
            <AdminFormImageUpload
              key={key}
              id={`branding-${key}`}
              label={t(`fields.${key}`)}
              variant="logo"
              value={form[key]}
              onChange={(value) => setForm((current) => ({ ...current, [key]: value }))}
              disabled={saving}
            />
          ))}
        </div>
      </section>

      <div className="appearance-theme-form__actions">
        <div className="appearance-theme-form__actions-main">
          <Button
            type="button"
            variant="secondary"
            className="admin-btn"
            onClick={() => (onCancel ? onCancel() : router.push(ROUTES.admin.theme.logos))}
            disabled={saving}
          >
            {t("cancel")}
          </Button>
          <Button type="submit" variant="primary" className="admin-btn" disabled={saving || !form.name.trim()}>
            {saving ? t("saving") : mode === "create" ? t("save") : t("update")}
          </Button>
        </div>
      </div>
    </form>
  );
}
