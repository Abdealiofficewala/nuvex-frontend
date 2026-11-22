"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AdminFormField } from "@/components/admin/common/AdminFormField";
import { Button } from "@/components/ui/buttons";
import { useToast } from "@/components/ui/toast";
import { DEFAULT_DESIGN } from "@/lib/appearance/defaults";
import { APPEARANCE_UPDATED_EVENT } from "@/lib/constants";
import { appearanceService } from "@/services/appearance.service";

export function ShapeSettingsPanel() {
  const t = useTranslations("admin.appearance.shapeSettings");
  const toast = useToast();
  const [borderRadius, setBorderRadius] = useState(DEFAULT_DESIGN.radius.md);
  const [buttonRadius, setButtonRadius] = useState(DEFAULT_DESIGN.components.button.radius);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    const active = await appearanceService.getActiveTheme();
    if (!active) return;
    setBorderRadius(active.design.radius.md);
    setButtonRadius(active.design.components.button.radius);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      void refresh().catch(() => toast.error(t("errors.title"), t("errors.load")));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [refresh, t, toast]);

  async function onSave(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      await appearanceService.updateShape({
        radius: { md: borderRadius },
        components: { button: { radius: buttonRadius } },
      });
      toast.success(t("success.title"), t("success.body"));
      window.dispatchEvent(new CustomEvent(APPEARANCE_UPDATED_EVENT));
    } catch {
      toast.error(t("errors.title"), t("errors.save"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="admin-create-form appearance-settings-form" onSubmit={onSave}>
      <div className="admin-form-grid admin-form-grid--2">
        <AdminFormField
          id="shape-border-radius"
          label={t("fields.borderRadius")}
          value={borderRadius}
          onChange={(event) => setBorderRadius(event.target.value)}
        />
        <AdminFormField
          id="shape-button-radius"
          label={t("fields.buttonRadius")}
          value={buttonRadius}
          onChange={(event) => setButtonRadius(event.target.value)}
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
