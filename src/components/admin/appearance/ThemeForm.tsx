"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { ThemeDraftPreviewModal } from "@/components/admin/appearance/ThemeDraftPreviewModal";
import { AdminFormField } from "@/components/admin/common/AdminFormField";
import { AdminFormSelect } from "@/components/admin/common/AdminFormSelect";
import { Button } from "@/components/ui/buttons";
import { useToast } from "@/components/ui/toast";
import { DEFAULT_DESIGN, DEFAULT_THEME_APPEARANCE } from "@/lib/appearance/defaults";
import { resolveThemeDraft } from "@/lib/appearance/resolve-theme";
import { normalizeThemeSchedule } from "@/lib/appearance/schedule";
import { normalizeSlug } from "@/lib/appearance/slug";
import { THEME_SCHEDULE_TIMEZONES } from "@/lib/appearance/timezones";
import { useAppearanceResources } from "@/lib/appearance/use-appearance-resources";
import { ROUTES } from "@/lib/constants";
import { appearanceService } from "@/services/appearance.service";
import type {
  AppearanceStore,
  ThemeActivationMode,
  ThemeActivationSchedule,
  ThemeAppearanceSettings,
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
  typographyId: string | null;
  appearance: ThemeAppearanceSettings;
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

function isScheduledMode(mode: ThemeActivationMode) {
  return mode === "scheduled" || mode === "interval";
}

function isScheduleComplete(schedule: ThemeActivationSchedule) {
  if (schedule.mode === "manual" || schedule.mode === "always") {
    return true;
  }

  if (isScheduledMode(schedule.mode) || schedule.mode === "from_date") {
    if (!schedule.startDate?.trim()) {
      return false;
    }

    if (isScheduledMode(schedule.mode)) {
      return Boolean(schedule.endDate?.trim());
    }

    return true;
  }

  return true;
}

function buildStore(
  branding: AppearanceStore["branding"],
  colorPalettes: AppearanceStore["colorPalettes"],
  typographyPresets: AppearanceStore["typographyPresets"],
  themes: ThemeRecord[],
): AppearanceStore {
  return {
    branding,
    colorPalettes,
    typographyPresets,
    themes,
    fonts: [],
    settings: { allowUserThemeSwitch: true, defaultColorScheme: "system" },
  };
}

export function ThemeForm({ mode, initialTheme }: ThemeFormProps) {
  const t = useTranslations("admin.appearance.themeForm");
  const toast = useToast();
  const router = useRouter();
  const {
    branding,
    colorPalettes,
    typographyPresets,
    loading: resourcesLoading,
  } = useAppearanceResources();
  const [existingThemes, setExistingThemes] = useState<ThemeRecord[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ThemeFormState>(() => ({
    name: initialTheme?.name ?? "",
    brandingId: initialTheme?.brandingId ?? null,
    colorPaletteId: initialTheme?.colorPaletteId ?? null,
    typographyId: initialTheme?.typographyId ?? null,
    appearance: initialTheme?.appearance ?? { ...DEFAULT_THEME_APPEARANCE },
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
      typographyId: form.typographyId ?? typographyPresets[0]?.id ?? null,
    }),
    [form, branding, colorPalettes, typographyPresets],
  );

  const store = useMemo(
    () => buildStore(branding, colorPalettes, typographyPresets, existingThemes),
    [branding, colorPalettes, typographyPresets, existingThemes],
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
          appearance: form.appearance,
        },
        initialTheme,
      ),
    [store, effectiveForm, form.schedule, form.appearance, initialTheme, t],
  );

  const activationModeOptions = useMemo(
    () =>
      (["manual", "always", "scheduled"] as ThemeActivationMode[]).map((value) => ({
        label: t(`schedule.modes.${value}`),
        value,
      })),
    [t],
  );

  const appearanceOptions = useMemo(
    () =>
      (["light", "dark", "system"] as const).map((value) => ({
        label: t(`appearance.modes.${value}`),
        value,
      })),
    [t],
  );

  const timezoneOptions = useMemo(
    () => THEME_SCHEDULE_TIMEZONES.map((zone) => ({ label: zone, value: zone })),
    [],
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

  function onActivationModeChange(modeValue: string) {
    const nextMode = modeValue as ThemeActivationMode;

    if (nextMode === "manual" || nextMode === "always") {
      updateSchedule({
        mode: nextMode,
        startDate: null,
        endDate: null,
        startTime: null,
        endTime: null,
        fallbackThemeId: null,
      });
      return;
    }

    updateSchedule({
      mode: "scheduled",
      startTime: form.schedule.startTime ?? "00:00",
      endTime: form.schedule.endTime ?? "23:59",
      timezone: form.schedule.timezone ?? "Asia/Kolkata",
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
      typographyId: effectiveForm.typographyId,
      appearance: form.appearance,
      disabled: initialTheme?.disabled ?? false,
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
  const typographyOptions = typographyPresets.map((item) => ({ label: item.name, value: item.id }));
  const missingResources =
    !resourcesLoading &&
    (branding.length === 0 || colorPalettes.length === 0 || typographyPresets.length === 0);
  const scheduleMode = form.schedule.mode;
  const showScheduleWindow = scheduleMode !== "manual" && scheduleMode !== "always";
  const submitDisabled =
    saving ||
    resourcesLoading ||
    missingResources ||
    !effectiveForm.name.trim() ||
    !isScheduleComplete(form.schedule);
  const previewReady =
    !resourcesLoading &&
    !missingResources &&
    Boolean(form.name.trim()) &&
    Boolean(form.brandingId) &&
    Boolean(form.colorPaletteId) &&
    Boolean(form.typographyId) &&
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
            id="theme-typography"
            label={t("fields.typography")}
            required
            value={form.typographyId ?? ""}
            options={typographyOptions}
            onChange={(value) => setForm((current) => ({ ...current, typographyId: value }))}
            disabled={saving || resourcesLoading}
          />
          <AdminFormSelect
            id="theme-appearance-mode"
            label={t("fields.appearance")}
            required
            value={form.appearance.colorScheme}
            options={appearanceOptions}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                appearance: {
                  ...current.appearance,
                  colorScheme: value as ThemeAppearanceSettings["colorScheme"],
                },
              }))
            }
            disabled={saving}
          />
          <AdminFormSelect
            id="theme-activation-mode"
            label={t("schedule.modeLabel")}
            required
            value={scheduleMode === "interval" ? "scheduled" : scheduleMode}
            options={activationModeOptions}
            onChange={onActivationModeChange}
            disabled={saving}
          />
          {showScheduleWindow ? (
            <>
              <AdminFormField
                id="theme-start-date"
                type="date"
                label={t("schedule.startDate")}
                required
                value={form.schedule.startDate ?? ""}
                onChange={(event) => updateSchedule({ startDate: event.target.value || null })}
                disabled={saving}
              />
              <AdminFormField
                id="theme-end-date"
                type="date"
                label={t("schedule.endDate")}
                required={isScheduledMode(scheduleMode)}
                value={form.schedule.endDate ?? ""}
                onChange={(event) => updateSchedule({ endDate: event.target.value || null })}
                disabled={saving}
              />
              <AdminFormField
                id="theme-start-time"
                type="time"
                label={t("schedule.startTime")}
                value={form.schedule.startTime ?? "00:00"}
                onChange={(event) => updateSchedule({ startTime: event.target.value || null })}
                disabled={saving}
              />
              <AdminFormField
                id="theme-end-time"
                type="time"
                label={t("schedule.endTime")}
                value={form.schedule.endTime ?? "23:59"}
                onChange={(event) => updateSchedule({ endTime: event.target.value || null })}
                disabled={saving}
              />
              <AdminFormSelect
                id="theme-timezone"
                label={t("schedule.timezone")}
                required
                value={form.schedule.timezone}
                options={timezoneOptions}
                onChange={(value) => updateSchedule({ timezone: value })}
                disabled={saving}
              />
              <AdminFormField
                id="theme-priority"
                type="number"
                label={t("schedule.priority")}
                min={0}
                value={String(form.schedule.priority ?? 0)}
                onChange={(event) =>
                  updateSchedule({ priority: Number.parseInt(event.target.value, 10) || 0 })
                }
                disabled={saving}
              />
              <AdminFormSelect
                id="theme-fallback"
                label={t("schedule.fallbackTheme")}
                value={form.schedule.fallbackThemeId ?? ""}
                options={[{ label: t("schedule.fallbackDefault"), value: "" }, ...fallbackThemeOptions]}
                onChange={(value) => updateSchedule({ fallbackThemeId: value || null })}
                disabled={saving}
              />
            </>
          ) : null}
        </div>
        {missingResources ? (
          <p className="appearance-static-note appearance-static-note--warning">{t("missingResources")}</p>
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
