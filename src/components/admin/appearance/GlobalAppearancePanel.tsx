"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AdminFormSelect } from "@/components/admin/common/AdminFormSelect";
import { Button } from "@/components/ui/buttons";
import { useToast } from "@/components/ui/toast";
import { APPEARANCE_UPDATED_EVENT } from "@/lib/constants";
import { appearanceService } from "@/services/appearance.service";
import type { GlobalAppearanceSettings, ThemeAppearanceMode } from "@/types/appearance";

export function GlobalAppearancePanel() {
  const t = useTranslations("admin.appearance.globalAppearance");
  const toast = useToast();
  const [settings, setSettings] = useState<GlobalAppearanceSettings | null>(null);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    setSettings(await appearanceService.getAppearanceSettings());
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      void refresh().catch(() => toast.error(t("errors.title"), t("errors.load")));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [refresh, t, toast]);

  const modeOptions = (["light", "dark", "system"] as ThemeAppearanceMode[]).map((value) => ({
    label: t(`modes.${value}`),
    value,
  }));

  async function onSave(event: React.FormEvent) {
    event.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      await appearanceService.updateAppearanceSettings(settings);
      toast.success(t("success.title"), t("success.body"));
      window.dispatchEvent(new CustomEvent(APPEARANCE_UPDATED_EVENT));
    } catch {
      toast.error(t("errors.title"), t("errors.save"));
    } finally {
      setSaving(false);
    }
  }

  if (!settings) {
    return null;
  }

  return (
    <form className="admin-create-form appearance-settings-form" onSubmit={onSave}>
      <div className="admin-form-grid admin-form-grid--2">
        <AdminFormSelect
          id="appearance-default-mode"
          label={t("fields.defaultMode")}
          value={settings.defaultColorScheme}
          options={modeOptions}
          onChange={(value) =>
            setSettings((current) =>
              current ? { ...current, defaultColorScheme: value as ThemeAppearanceMode } : current,
            )
          }
        />
        <AdminFormSelect
          id="appearance-user-switch"
          label={t("fields.allowUserThemeSwitch")}
          value={settings.allowUserThemeSwitch ? "yes" : "no"}
          options={[
            { label: t("options.yes"), value: "yes" },
            { label: t("options.no"), value: "no" },
          ]}
          onChange={(value) =>
            setSettings((current) =>
              current ? { ...current, allowUserThemeSwitch: value === "yes" } : current,
            )
          }
        />
      </div>
      <div className="admin-form-actions">
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? t("saving") : t("save")}
        </Button>
      </div>
    </form>
  );
}
