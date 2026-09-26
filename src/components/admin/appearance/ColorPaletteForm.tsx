"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { AdminColorField } from "@/components/admin/common/AdminColorField";
import { AdminFormField } from "@/components/admin/common/AdminFormField";
import { Button } from "@/components/ui/buttons";
import { useToast } from "@/components/ui/toast";
import { COLOR_PALETTE_GROUPS, type ColorPaletteTokenKey } from "@/lib/appearance/color-palette-groups";
import { createEmptyColorTokens } from "@/lib/appearance/defaults";
import { normalizeSlug } from "@/lib/appearance/slug";
import { ROUTES } from "@/lib/constants";
import { appearanceService } from "@/services/appearance.service";
import type { AppearanceColorTokens, ColorPaletteInput, ColorPaletteRecord } from "@/types/appearance";

type ColorPaletteFormProps = {
  mode: "create" | "edit";
  initial?: ColorPaletteRecord;
  embedded?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function ColorPaletteForm({ mode, initial, onSuccess, onCancel }: ColorPaletteFormProps) {
  const t = useTranslations("admin.appearance.colorForm");
  const toast = useToast();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ColorPaletteInput>({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    description: "",
    colors: initial?.colors ?? createEmptyColorTokens(),
  });

  const previewContext = useMemo(
    () => ({
      background: form.colors.background,
      surface: form.colors.surface,
      text: form.colors.text,
      muted: form.colors.muted,
      border: form.colors.border,
    }),
    [form.colors.background, form.colors.border, form.colors.muted, form.colors.surface, form.colors.text],
  );

  function updateColor(key: keyof AppearanceColorTokens, value: string) {
    setForm((current) => ({
      ...current,
      colors: { ...current.colors, [key]: value },
    }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);

    const payload: ColorPaletteInput = {
      ...form,
      description: "",
      slug: normalizeSlug(form.slug || form.name),
    };

    try {
      if (mode === "create") {
        await appearanceService.createColorPalette(payload);
        toast.success(t("success.createTitle"), t("success.createBody"));
      } else if (initial) {
        await appearanceService.updateColorPalette(initial.id, payload);
        toast.success(t("success.updateTitle"), t("success.updateBody"));
      }

      onSuccess?.();
      if (!onSuccess) {
        router.push(ROUTES.admin.theme.colors);
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
          id="palette-name"
          label={t("fields.name")}
          required
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          disabled={saving}
        />
        <AdminFormField
          id="palette-slug"
          label={t("fields.slug")}
          value={form.slug}
          onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
          disabled={saving}
        />
      </div>

      <div className="appearance-color-sections">
        {COLOR_PALETTE_GROUPS.map((group) => (
          <section key={group.id} className="appearance-color-section">
            <header className="appearance-color-section__head">
              <h3 className="appearance-color-section__title">{t(`sections.${group.id}.title`)}</h3>
              <p className="appearance-color-section__description">{t(`sections.${group.id}.description`)}</p>
            </header>

            <div className="appearance-color-grid">
              {group.keys.map((key) => (
                <AdminColorField
                  key={key}
                  id={`palette-color-${key}`}
                  label={t(`colors.${key}`)}
                  token={key as ColorPaletteTokenKey}
                  examples={t(`colorsExamples.${key}`)}
                  previewContext={previewContext}
                  value={form.colors[key]}
                  disabled={saving}
                  onChange={(value) => updateColor(key, value)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="appearance-theme-form__actions">
        <div className="appearance-theme-form__actions-main">
          <Button
            type="button"
            variant="secondary"
            className="admin-btn"
            onClick={() => (onCancel ? onCancel() : router.push(ROUTES.admin.theme.colors))}
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
