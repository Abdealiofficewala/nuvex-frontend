"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { AdminFormField } from "@/components/admin/common/AdminFormField";
import { AdminFormSelect } from "@/components/admin/common/AdminFormSelect";
import { Button } from "@/components/ui/buttons";
import { useToast } from "@/components/ui/toast";
import { APPEARANCE_UPDATED_EVENT } from "@/lib/constants";
import { appearanceService } from "@/services/appearance.service";
import type { FontRecord, TypographyPresetRecord } from "@/types/appearance";

const DEFAULT_PRESET_ID = "typography-default";

export function TypographySettingsPanel() {
  const t = useTranslations("admin.appearance.typographySettings");
  const toast = useToast();
  const [fonts, setFonts] = useState<FontRecord[]>([]);
  const [preset, setPreset] = useState<TypographyPresetRecord | null>(null);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    const [fontList, typography] = await Promise.all([
      appearanceService.listFonts(),
      appearanceService.getTypographyPreset(DEFAULT_PRESET_ID),
    ]);
    setFonts(fontList);
    setPreset(typography);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      void refresh().catch(() => {
        toast.error(t("errors.title"), t("errors.load"));
      });
    });
    const onUpdated = () => void refresh();
    window.addEventListener(APPEARANCE_UPDATED_EVENT, onUpdated);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener(APPEARANCE_UPDATED_EVENT, onUpdated);
    };
  }, [refresh, t, toast]);

  const fontOptions = useMemo(
    () => fonts.filter((font) => font.status === "active").map((font) => ({ label: font.name, value: font.id })),
    [fonts],
  );

  async function onSave(event: React.FormEvent) {
    event.preventDefault();
    if (!preset) return;

    setSaving(true);
    try {
      await appearanceService.updateTypographyPreset(preset.id, {
        headingFontId: preset.headingFontId,
        bodyFontId: preset.bodyFontId,
      });
      toast.success(t("success.title"), t("success.body"));
      window.dispatchEvent(new CustomEvent(APPEARANCE_UPDATED_EVENT));
    } catch {
      toast.error(t("errors.title"), t("errors.save"));
    } finally {
      setSaving(false);
    }
  }

  if (!preset) {
    return null;
  }

  return (
    <form className="admin-create-form appearance-settings-form" onSubmit={onSave}>
      <div className="admin-form-grid admin-form-grid--2">
        <AdminFormSelect
          id="typography-heading-font"
          label={t("fields.headingFont")}
          value={preset.headingFontId}
          options={fontOptions}
          onChange={(value) => setPreset((current) => current && { ...current, headingFontId: value })}
        />
        <AdminFormSelect
          id="typography-body-font"
          label={t("fields.bodyFont")}
          value={preset.bodyFontId}
          options={fontOptions}
          onChange={(value) => setPreset((current) => current && { ...current, bodyFontId: value })}
        />
        <AdminFormField
          id="typography-scale"
          label={t("fields.scale")}
          value={preset.tokens.baseFontSize}
          readOnly
        />
      </div>

      <section className="appearance-font-library">
        <h3>{t("library.title")}</h3>
        <ul className="appearance-font-library__list">
          {fonts.map((font) => (
            <li key={font.id}>
              <strong>{font.name}</strong>
              <span>{font.source}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="admin-form-actions">
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? t("saving") : t("save")}
        </Button>
      </div>
    </form>
  );
}
