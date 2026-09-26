"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { ThemeDraftPreviewModal } from "@/components/admin/appearance/ThemeDraftPreviewModal";
import { AdminFormField } from "@/components/admin/common/AdminFormField";
import { AdminFormSelect } from "@/components/admin/common/AdminFormSelect";
import { Button } from "@/components/ui/buttons";
import { useToast } from "@/components/ui/toast";
import { DEFAULT_DESIGN } from "@/lib/appearance/defaults";
import { resolveThemeDraft } from "@/lib/appearance/resolve-theme";
import { normalizeThemeSchedule } from "@/lib/appearance/schedule";
import { normalizeSlug } from "@/lib/appearance/slug";
import { useAppearanceResources } from "@/lib/appearance/use-appearance-resources";
import { ROUTES } from "@/lib/constants";
import { appearanceService } from "@/services/appearance.service";
import type {
  AppearanceStore,
  ThemeActivationMode,
  ThemeActivationSchedule,
  ThemeInput,
  ThemeRecord,
} from "@/types/appearance";

type ThemeFormProps = {
  mode: "create" | "edit";
  initialTheme?: ThemeRecord;
};

type ThemeFormState = {
  name: string;
  brandingId: string | null;
  colorPaletteId: string | null;
  schedule: ThemeActivationSchedule;
};

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

function isScheduleComplete(schedule: ThemeActivationSchedule) {
  if (schedule.mode === "manual") {
    return true;
  }

  if (!schedule.startDate?.trim()) {
    return false;
  }

  if (schedule.mode === "from_date") {
    return true;
  }

  return Boolean(schedule.endDate?.trim() && schedule.fallbackThemeId);
}

function buildStore(
  branding: AppearanceStore["branding"],
  colorPalettes: AppearanceStore["colorPalettes"],
  themes: ThemeRecord[],
): AppearanceStore {
  return { branding, colorPalettes, themes };
}

export function ThemeForm({ mode, initialTheme }: ThemeFormProps) {
  const t = useTranslations("admin.appearance.themeForm");
  const toast = useToast();
  const router = useRouter();
  const { branding, colorPalettes, loading: resourcesLoading } = useAppearanceResources();
  const [existingThemes, setExistingThemes] = useState<ThemeRecord[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ThemeFormState>(() => ({
    name: initialTheme?.name ?? "",
    brandingId: initialTheme?.brandingId ?? null,
    colorPaletteId: initialTheme?.colorPaletteId ?? null,
    schedule: normalizeThemeSchedule(initialTheme?.schedule),
  }));

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      void appearanceService.listThemes().then((items) => {
        setExistingThemes(items.map((item) => item));
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const effectiveForm = useMemo(
    () => ({
      ...form,
      brandingId: form.brandingId ?? branding[0]?.id ?? null,
      colorPaletteId: form.colorPaletteId ?? colorPalettes[0]?.id ?? null,
    }),
    [form, branding, colorPalettes],
  );

  const store = useMemo(
    () => buildStore(branding, colorPalettes, existingThemes),
    [branding, colorPalettes, existingThemes],
  );

  const previewResolved = useMemo(
    () =>
      resolveThemeDraft(
        store,
        {
          ...effectiveForm,
          id: initialTheme?.id,
          name: effectiveForm.name || t("draftName"),
          slug: normalizeSlug(effectiveForm.name || "draft"),
          schedule: form.schedule,
        },
        initialTheme,
      ),
    [store, effectiveForm, form.schedule, initialTheme, t],
  );

  const activationModeOptions = useMemo(
    () =>
      (["manual", "interval", "from_date"] as ThemeActivationMode[]).map((value) => ({
        label: t(`schedule.modes.${value}`),
        value,
      })),
    [t],
  );

  const fallbackThemeOptions = useMemo(
    () =>
      existingThemes
        .filter((theme) => theme.id !== initialTheme?.id)
        .map((theme) => ({ label: theme.name, value: theme.id })),
    [existingThemes, initialTheme?.id],
  );

  function updateSchedule(patch: Partial<ThemeActivationSchedule>) {
    setForm((current) => ({
      ...current,
      schedule: normalizeThemeSchedule({ ...current.schedule, ...patch }),
    }));
  }

  function onActivationModeChange(mode: string) {
    const nextMode = mode as ThemeActivationMode;
    updateSchedule({
      mode: nextMode,
      startDate: nextMode === "manual" ? null : form.schedule.startDate,
      endDate: nextMode === "interval" ? form.schedule.endDate : null,
      fallbackThemeId: nextMode === "interval" ? form.schedule.fallbackThemeId : null,
    });
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);

    const payload: ThemeInput = {
      name: effectiveForm.name.trim(),
      slug: normalizeSlug(effectiveForm.name),
      description: initialTheme?.description ?? "",
      brandingId: effectiveForm.brandingId,
      colorPaletteId: effectiveForm.colorPaletteId,
      schedule: normalizeThemeSchedule(form.schedule),
      design: initialTheme?.design ?? structuredClone(DEFAULT_DESIGN),
    };

    try {
      if (mode === "create") {
        await appearanceService.createTheme(payload);
        toast.success(t("success.createTitle"), t("success.createBody"));
        router.push(ROUTES.admin.theme.listing);
        return;
      }

      if (!initialTheme) {
        throw new Error("missing-theme");
      }

      await appearanceService.updateTheme(initialTheme.id, payload);
      toast.success(t("success.updateTitle"), t("success.updateBody"));
      router.push(ROUTES.admin.theme.listing);
    } catch (error) {
      const message = error instanceof Error ? error.message : t("errors.generic");
      toast.error(t("errors.title"), message);
    } finally {
      setSaving(false);
    }
  }

  const brandingOptions = branding.map((item) => ({ label: item.name, value: item.id }));
  const paletteOptions = colorPalettes.map((item) => ({ label: item.name, value: item.id }));
  const missingResources = !resourcesLoading && (branding.length === 0 || colorPalettes.length === 0);
  const scheduleMode = form.schedule.mode;
  const needsFallback = scheduleMode === "interval" && fallbackThemeOptions.length === 0;
  const submitDisabled =
    saving || resourcesLoading || missingResources || needsFallback || !effectiveForm.name.trim();
  const previewReady =
    !resourcesLoading &&
    !missingResources &&
    Boolean(form.name.trim()) &&
    Boolean(form.brandingId) &&
    Boolean(form.colorPaletteId) &&
    isScheduleComplete(form.schedule);
  const previewDisabled = !previewReady;

  return (
    <>
      <form className="appearance-resource-form admin-create-form" onSubmit={onSubmit}>
        <div className="admin-form-grid admin-form-grid--2">
          <div className="admin-form-grid__full">
            <AdminFormField
              id="theme-name"
              label={t("fields.name")}
              required
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              disabled={saving || resourcesLoading}
            />
          </div>
          <AdminFormSelect
            id="theme-branding"
            label={t("fields.branding")}
            required
            value={form.brandingId ?? ""}
            options={brandingOptions}
            onChange={(value) => setForm((current) => ({ ...current, brandingId: value }))}
            disabled={saving || resourcesLoading}
          />
          <AdminFormSelect
            id="theme-colors"
            label={t("fields.colors")}
            required
            value={form.colorPaletteId ?? ""}
            options={paletteOptions}
            onChange={(value) => setForm((current) => ({ ...current, colorPaletteId: value }))}
            disabled={saving || resourcesLoading}
          />
          <AdminFormSelect
            id="theme-activation-mode"
            label={t("schedule.modeLabel")}
            required
            value={form.schedule.mode}
            options={activationModeOptions}
            onChange={onActivationModeChange}
            disabled={saving}
          />
          {scheduleMode !== "manual" ? (
            <AdminFormField
              id="theme-start-date"
              type="date"
              label={t("schedule.startDate")}
              required
              value={form.schedule.startDate ?? ""}
              onChange={(event) => updateSchedule({ startDate: event.target.value || null })}
              disabled={saving}
            />
          ) : null}
          {scheduleMode === "interval" ? (
            <>
              <AdminFormField
                id="theme-end-date"
                type="date"
                label={t("schedule.endDate")}
                required
                value={form.schedule.endDate ?? ""}
                onChange={(event) => updateSchedule({ endDate: event.target.value || null })}
                disabled={saving}
              />
              <AdminFormSelect
                id="theme-fallback"
                label={t("schedule.fallbackTheme")}
                required
                value={form.schedule.fallbackThemeId ?? ""}
                options={fallbackThemeOptions}
                onChange={(value) => updateSchedule({ fallbackThemeId: value || null })}
                disabled={saving || needsFallback}
              />
            </>
          ) : null}
        </div>
        {missingResources ? (
          <p className="appearance-static-note appearance-static-note--warning">{t("missingResources")}</p>
        ) : null}
        {scheduleMode === "interval" && needsFallback ? (
          <p className="appearance-static-note appearance-static-note--warning">{t("schedule.noFallbackThemes")}</p>
        ) : null}

        <div className="appearance-theme-form__actions appearance-theme-form__actions--split">
          <Button
            type="button"
            variant="secondary"
            className="admin-btn admin-page-actions__btn--preview"
            onClick={() => setPreviewOpen(true)}
            disabled={previewDisabled}
          >
            <PreviewIcon />
            {t("previewAction")}
          </Button>
          <div className="appearance-theme-form__actions-main">
            <Button
              type="button"
              variant="secondary"
              className="admin-btn"
              onClick={() => router.push(ROUTES.admin.theme.listing)}
              disabled={saving}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" variant="primary" className="admin-btn" disabled={submitDisabled}>
              {saving ? t("saving") : mode === "create" ? t("save") : t("update")}
            </Button>
          </div>
        </div>
      </form>

      <ThemeDraftPreviewModal
        open={previewOpen}
        resolved={previewResolved}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  );
}
