"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { AdminFormField } from "@/components/admin/common/AdminFormField";
import { AdminFormSelect } from "@/components/admin/common/AdminFormSelect";
import { AdminFormTextarea } from "@/components/admin/common/AdminFormTextarea";
import { AdminFormImageUpload } from "@/components/admin/common";
import { Button, ButtonLink } from "@/components/ui/buttons";
import { useToast } from "@/components/ui/toast";
import { normalizeSlug } from "@/lib/appearance/slug";
import { industryViewHref, ROUTES } from "@/lib/constants";
import {
  isIndustryFormValid,
  validateIndustryInput,
  type ContentErrorKey,
} from "@/lib/validations/content";
import { contentService } from "@/services/content.service";
import type { ContentStatus, IndustryInput, IndustryRecord } from "@/types/content-admin";

type IndustryField = keyof IndustryInput;

type IndustryFormProps = {
  editId?: string;
};

export function IndustryForm({ editId }: IndustryFormProps) {
  const isEdit = Boolean(editId);
  const t = useTranslations(isEdit ? "admin.industries.listing.edit" : "admin.industries.listing.create");
  const toast = useToast();
  const router = useRouter();
  const nameId = useId();
  const slugId = useId();
  const summaryId = useId();
  const descriptionId = useId();
  const [form, setForm] = useState<IndustryInput>({
    slug: "",
    name: "",
    summary: "",
    description: "",
    image: "",
    status: "active",
  });
  const [touchedFields, setTouchedFields] = useState<Partial<Record<IndustryField, boolean>>>({});
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(!isEdit);
  const [existing, setExisting] = useState<IndustryRecord | null>(null);

  const statusOptions = useMemo(
    () => [
      { value: "active", label: t("status.active") },
      { value: "draft", label: t("status.draft") },
    ],
    [t],
  );

  useEffect(() => {
    if (!isEdit || !editId) {
      return;
    }

    contentService
      .getIndustry(editId)
      .then((industry) => {
        setExisting(industry);
        setForm({
          slug: industry.slug,
          name: industry.name,
          summary: industry.summary,
          description: industry.description,
          image: industry.image,
          status: industry.status,
        });
      })
      .catch(() => setExisting(null))
      .finally(() => setLoaded(true));
  }, [editId, isEdit]);

  const fieldErrors = validateIndustryInput(form);
  const canSave = loaded && isIndustryFormValid(fieldErrors);

  function touchField(field: IndustryField) {
    setTouchedFields((current) => ({ ...current, [field]: true }));
  }

  function touchAllFields() {
    setTouchedFields({
      slug: true,
      name: true,
      summary: true,
      description: true,
      image: true,
      status: true,
    });
  }

  function getVisibleFieldError(field: IndustryField): ContentErrorKey | undefined {
    if (!touchedFields[field]) {
      return undefined;
    }

    return fieldErrors[field];
  }

  function getFieldErrorMessage(errorKey: string) {
    return t(`errors.${errorKey}` as "errors.required");
  }

  function updateField<K extends IndustryField>(field: K, value: IndustryInput[K]) {
    touchField(field);
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    touchAllFields();

    const submitPayload: IndustryInput = {
      ...form,
      slug: normalizeSlug(form.slug || form.name),
      name: form.name.trim(),
      summary: form.summary.trim(),
      description: form.description.trim(),
    };

    if (!isIndustryFormValid(validateIndustryInput(submitPayload))) {
      toast.error(t("errors.title"), t("errors.validation"));
      return;
    }

    setSaving(true);

    try {
      if (isEdit && editId) {
        const updated = await contentService.updateIndustry(editId, submitPayload);
        toast.success(t("success.title"), t("success.body"));
        router.push(industryViewHref(updated.id));
        return;
      }

      await contentService.createIndustry(submitPayload);
      toast.success(t("success.title"), t("success.body"));
      router.push(ROUTES.admin.industries.listing);
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
        <ButtonLink href={ROUTES.admin.industries.listing} variant="secondary">
          {t("cancelAction")}
        </ButtonLink>
      </div>
    );
  }

  return (
    <form className="admin-banner-form admin-create-form" onSubmit={onSubmit} noValidate>
      <div className="admin-panel admin-banner-form__panel">
        <div className="admin-banner-form__body admin-form-grid admin-form-grid--2">
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

          <AdminFormSelect
            id="industry-status"
            label={t("fields.status")}
            required
            value={form.status}
            options={statusOptions}
            onChange={(value) => updateField("status", value as ContentStatus)}
            onBlur={() => touchField("status")}
            disabled={saving || !loaded}
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

          <div className="admin-banner-form__upload admin-form-grid__full">
            <AdminFormImageUpload
              id="industry-image"
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
            onClick={() => router.push(ROUTES.admin.industries.listing)}
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
