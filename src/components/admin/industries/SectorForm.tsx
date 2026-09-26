"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { AdminFormField } from "@/components/admin/common/AdminFormField";
import { AdminFormSelect } from "@/components/admin/common/AdminFormSelect";
import { AdminFormTextarea } from "@/components/admin/common/AdminFormTextarea";
import { AdminFormImageUpload } from "@/components/admin/common";
import { Button, ButtonLink } from "@/components/ui/buttons";
import { useToast } from "@/components/ui/toast";
import { normalizeSlug } from "@/lib/appearance/slug";
import { ROUTES, sectorViewHref } from "@/lib/constants";
import {
  isSectorFormValid,
  joinLines,
  parseLines,
  validateSectorInput,
  type ContentErrorKey,
} from "@/lib/validations/content";
import { contentService } from "@/services/content.service";
import type { ContentStatus, IndustryRecord, SectorInput, SectorRecord } from "@/types/content-admin";

type SectorField = keyof SectorInput;

type SectorFormProps = {
  editId?: string;
  defaultIndustryId?: string;
  cancelHref?: string;
};

export function SectorForm({ editId, defaultIndustryId, cancelHref }: SectorFormProps) {
  const isEdit = Boolean(editId);
  const t = useTranslations(isEdit ? "admin.industries.sectors.edit" : "admin.industries.sectors.create");
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nameId = useId();
  const slugId = useId();
  const summaryId = useId();
  const descriptionId = useId();
  const [form, setForm] = useState<SectorInput>({
    industryId: defaultIndustryId ?? searchParams.get("industryId") ?? "",
    slug: "",
    name: "",
    summary: "",
    description: "",
    image: "",
    applications: [],
    status: "active",
  });
  const [applicationsText, setApplicationsText] = useState("");
  const [industries, setIndustries] = useState<IndustryRecord[]>([]);
  const [touchedFields, setTouchedFields] = useState<Partial<Record<SectorField, boolean>>>({});
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(!isEdit);
  const [existing, setExisting] = useState<SectorRecord | null>(null);

  const resolvedCancelHref = cancelHref ?? ROUTES.admin.industries.sectors;

  useEffect(() => {
    contentService
      .listIndustries()
      .then(setIndustries)
      .catch(() => setIndustries([]));
  }, []);

  useEffect(() => {
    if (!isEdit || !editId) {
      return;
    }

    contentService
      .getSector(editId)
      .then((sector) => {
        setExisting(sector);
        setForm({
          industryId: sector.industryId,
          slug: sector.slug,
          name: sector.name,
          summary: sector.summary,
          description: sector.description,
          image: sector.image,
          applications: sector.applications,
          status: sector.status,
        });
        setApplicationsText(joinLines(sector.applications));
      })
      .catch(() => setExisting(null))
      .finally(() => setLoaded(true));
  }, [editId, isEdit]);

  const industryOptions = useMemo(
    () => industries.map((item) => ({ value: item.id, label: item.name })),
    [industries],
  );

  const statusOptions = useMemo(
    () => [
      { value: "active", label: t("status.active") },
      { value: "draft", label: t("status.draft") },
    ],
    [t],
  );

  const payload: SectorInput = { ...form, applications: parseLines(applicationsText) };
  const fieldErrors = validateSectorInput(payload, industries);
  const canSave = loaded && isSectorFormValid(fieldErrors) && industries.length > 0;

  function touchField(field: SectorField) {
    setTouchedFields((current) => ({ ...current, [field]: true }));
  }

  function touchAllFields() {
    setTouchedFields({
      industryId: true,
      slug: true,
      name: true,
      summary: true,
      description: true,
      image: true,
      applications: true,
      status: true,
    });
  }

  function getVisibleFieldError(field: SectorField): ContentErrorKey | undefined {
    if (!touchedFields[field]) {
      return undefined;
    }

    return fieldErrors[field];
  }

  function getFieldErrorMessage(errorKey: string) {
    return t(`errors.${errorKey}` as "errors.required");
  }

  function updateField<K extends SectorField>(field: K, value: SectorInput[K]) {
    touchField(field);
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    touchAllFields();

    const submitPayload: SectorInput = {
      ...form,
      slug: normalizeSlug(form.slug || form.name),
      name: form.name.trim(),
      summary: form.summary.trim(),
      description: form.description.trim(),
      applications: parseLines(applicationsText),
    };

    if (!isSectorFormValid(validateSectorInput(submitPayload, industries))) {
      toast.error(t("errors.title"), t("errors.validation"));
      return;
    }

    setSaving(true);

    try {
      if (isEdit && editId) {
        const updated = await contentService.updateSector(editId, submitPayload);
        toast.success(t("success.title"), t("success.body"));
        router.push(sectorViewHref(updated.id));
        return;
      }

      await contentService.createSector(submitPayload);
      toast.success(t("success.title"), t("success.body"));
      router.push(resolvedCancelHref);
    } catch (error) {
      toast.error(t("errors.title"), error instanceof Error ? error.message : t("errors.generic"));
    } finally {
      setSaving(false);
    }
  }

  if (isEdit && loaded && !existing) {
    return (
      <div className="admin-role-view admin-role-view--empty">
        <p className="admin-role-view__empty-title">{t("notFound.title")}</p>
        <p className="admin-role-view__empty-body">{t("notFound.body")}</p>
        <ButtonLink href={resolvedCancelHref} variant="secondary">
          {t("cancelAction")}
        </ButtonLink>
      </div>
    );
  }

  return (
    <form className="admin-banner-form admin-create-form" onSubmit={onSubmit} noValidate>
      <div className="admin-panel admin-banner-form__panel">
        <div className="admin-banner-form__body admin-form-grid admin-form-grid--2">
          <AdminFormSelect
            id="sector-industry"
            label={t("fields.industry")}
            required
            value={form.industryId}
            options={industryOptions}
            placeholder={t("placeholders.industry")}
            fieldError={getVisibleFieldError("industryId")}
            getErrorMessage={getFieldErrorMessage}
            onChange={(value) => updateField("industryId", value)}
            onBlur={() => touchField("industryId")}
            disabled={saving || !loaded || !industries.length}
          />

          <AdminFormSelect
            id="sector-status"
            label={t("fields.status")}
            required
            value={form.status}
            options={statusOptions}
            onChange={(value) => updateField("status", value as ContentStatus)}
            onBlur={() => touchField("status")}
            disabled={saving || !loaded}
          />

          <AdminFormField
            id={nameId}
            label={t("fields.name")}
            required
            fieldError={getVisibleFieldError("name")}
            getErrorMessage={getFieldErrorMessage}
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            onBlur={() => touchField("name")}
            placeholder={t("placeholders.name")}
            disabled={saving || !loaded}
          />

          <AdminFormField
            id={slugId}
            label={t("fields.slug")}
            fieldError={getVisibleFieldError("slug")}
            getErrorMessage={getFieldErrorMessage}
            value={form.slug}
            onChange={(event) => updateField("slug", event.target.value)}
            onBlur={() => touchField("slug")}
            placeholder={t("placeholders.slug")}
            disabled={saving || !loaded}
            spellCheck={false}
          />

          <div className="admin-form-grid__full">
            <AdminFormTextarea
              id={summaryId}
              label={t("fields.summary")}
              value={form.summary}
              onChange={(event) => updateField("summary", event.target.value)}
              onBlur={() => touchField("summary")}
              placeholder={t("placeholders.summary")}
              disabled={saving || !loaded}
              rows={2}
            />
          </div>

          <div className="admin-form-grid__full">
            <AdminFormTextarea
              id={descriptionId}
              label={t("fields.description")}
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              onBlur={() => touchField("description")}
              placeholder={t("placeholders.description")}
              disabled={saving || !loaded}
              rows={4}
            />
          </div>

          <div className="admin-form-grid__full">
            <AdminFormTextarea
              id="sector-applications"
              label={t("fields.applications")}
              value={applicationsText}
              onChange={(event) => setApplicationsText(event.target.value)}
              placeholder={t("placeholders.listLines")}
              disabled={saving || !loaded}
              rows={3}
            />
          </div>

          <div className="admin-banner-form__upload admin-form-grid__full">
            <AdminFormImageUpload
              id="sector-image"
              label={t("fields.image")}
              required
              variant="banner"
              value={form.image}
              onChange={(value) => updateField("image", value)}
              onBlur={() => touchField("image")}
              fieldError={getVisibleFieldError("image")}
              getErrorMessage={getFieldErrorMessage}
              disabled={saving || !loaded}
            />
          </div>
        </div>

        <div className="admin-page-actions admin-page-actions--form">
          <Button
            type="button"
            variant="secondary"
            className="admin-page-actions__btn admin-page-actions__btn--reset"
            disabled={saving}
            onClick={() => router.push(resolvedCancelHref)}
          >
            {t("cancelAction")}
          </Button>
          <Button
            type="submit"
            variant="accent"
            className="admin-page-actions__btn admin-page-actions__btn--save"
            disabled={saving || !canSave}
          >
            {saving ? t("saving") : t("save")}
          </Button>
        </div>
      </div>
    </form>
  );
}
