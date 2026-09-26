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
import { ROUTES, bannerViewHref } from "@/lib/constants";
import { WEBSITE_MODULE_OPTIONS } from "@/lib/website-modules";
import {
  isBannerFormValid,
  validateBannerInput,
  type ContentErrorKey,
} from "@/lib/validations/content";
import { contentService } from "@/services/content.service";
import type { BannerInput, BannerRecord, ContentStatus } from "@/types/content-admin";

type BannerField = keyof BannerInput;

type BannerFormProps = {
  editId?: string;
};

export function BannerForm({ editId }: BannerFormProps) {
  const isEdit = Boolean(editId);
  const t = useTranslations(isEdit ? "admin.hero.banners.edit" : "admin.hero.banners.create");
  const tModules = useTranslations("admin.hero.banners.modules");
  const toast = useToast();
  const router = useRouter();
  const titleId = useId();
  const slugId = useId();
  const eyebrowId = useId();
  const bodyId = useId();
  const [form, setForm] = useState<BannerInput>({
    slug: "",
    title: "",
    eyebrow: "",
    body: "",
    image: "",
    pageRoute: ROUTES.home,
    status: "draft",
  });
  const [existingPageRoutes, setExistingPageRoutes] = useState<string[]>([]);
  const [touchedFields, setTouchedFields] = useState<Partial<Record<BannerField, boolean>>>({});
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(!isEdit);
  const [existing, setExisting] = useState<BannerRecord | null>(null);

  const moduleOptions = useMemo(
    () =>
      WEBSITE_MODULE_OPTIONS.map((module) => ({
        label: tModules(module.labelKey),
        value: module.value,
      })),
    [tModules],
  );

  useEffect(() => {
    contentService
      .listBanners()
      .then((banners) => {
        setExistingPageRoutes(
          banners.filter((banner) => banner.id !== editId).map((banner) => banner.pageRoute),
        );
      })
      .catch(() => setExistingPageRoutes([]));
  }, [editId]);

  useEffect(() => {
    if (!isEdit || !editId) {
      return;
    }

    contentService
      .getBanner(editId)
      .then((banner) => {
        setExisting(banner);
        setForm({
          slug: banner.slug,
          title: banner.title,
          eyebrow: banner.eyebrow,
          body: banner.body,
          image: banner.image,
          pageRoute: banner.pageRoute,
          status: banner.status,
        });
      })
      .catch(() => {
        setExisting(null);
      })
      .finally(() => setLoaded(true));
  }, [editId, isEdit]);

  const validationOptions = isEdit
    ? { existingPageRoutes, excludePageRoute: existing?.pageRoute }
    : { existingPageRoutes };
  const fieldErrors = validateBannerInput(form, validationOptions);
  const canSave = loaded && isBannerFormValid(fieldErrors);

  function touchField(field: BannerField) {
    setTouchedFields((current) => ({ ...current, [field]: true }));
  }

  function touchAllFields() {
    setTouchedFields({
      slug: true,
      title: true,
      eyebrow: true,
      body: true,
      image: true,
      pageRoute: true,
      status: true,
    });
  }

  function getVisibleFieldError(field: BannerField): ContentErrorKey | undefined {
    if (!touchedFields[field]) {
      return undefined;
    }

    return fieldErrors[field];
  }

  function getFieldErrorMessage(errorKey: string) {
    return t(`errors.${errorKey}` as "errors.required");
  }

  function updateField<K extends BannerField>(field: K, value: BannerInput[K]) {
    touchField(field);
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    touchAllFields();

    const submitErrors = validateBannerInput(form, validationOptions);
    if (!isBannerFormValid(submitErrors)) {
      toast.error(t("errors.title"), t("errors.validation"));
      return;
    }

    const payload: BannerInput = {
      ...form,
      slug: normalizeSlug(form.slug || form.title),
      title: form.title.trim(),
      eyebrow: form.eyebrow.trim(),
      body: form.body.trim(),
      pageRoute: form.pageRoute,
    };

    setSaving(true);

    try {
      if (isEdit && editId) {
        const updated = await contentService.updateBanner(editId, payload);
        toast.success(t("success.title"), t("success.body"));
        router.push(bannerViewHref(updated.id));
        return;
      }

      await contentService.createBanner(payload);
      toast.success(t("success.title"), t("success.body"));
      router.push(ROUTES.admin.banners.listing);
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
        <ButtonLink href={ROUTES.admin.banners.listing} variant="secondary">
          {t("cancelAction")}
        </ButtonLink>
      </div>
    );
  }

  const statusOptions = [
    { label: t("fields.statusActive"), value: "active" },
    { label: t("fields.statusDraft"), value: "draft" },
  ];

  return (
    <form className="admin-banner-form admin-create-form" onSubmit={onSubmit} noValidate>
      <div className="admin-panel admin-banner-form__panel">
        <div className="admin-banner-form__body admin-form-grid admin-form-grid--2">
          <AdminFormSelect
            id="banner-page-route"
            label={t("fields.pageRoute")}
            required
            value={form.pageRoute}
            options={moduleOptions}
            placeholder={t("placeholders.pageRoute")}
            fieldError={getVisibleFieldError("pageRoute")}
            getErrorMessage={getFieldErrorMessage}
            onChange={(value) => updateField("pageRoute", value)}
            onBlur={() => touchField("pageRoute")}
            disabled={saving || !loaded}
          />

          <AdminFormSelect
            id="banner-status"
            label={t("fields.status")}
            value={form.status}
            options={statusOptions}
            onChange={(value) => updateField("status", value as ContentStatus)}
            onBlur={() => touchField("status")}
            disabled={saving || !loaded}
          />

          <AdminFormField
            id={titleId}
            label={t("fields.title")}
            required
            fieldError={getVisibleFieldError("title")}
            getErrorMessage={getFieldErrorMessage}
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            onBlur={() => touchField("title")}
            placeholder={t("placeholders.title")}
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

          <AdminFormField
            id={eyebrowId}
            label={t("fields.eyebrow")}
            value={form.eyebrow}
            onChange={(event) => updateField("eyebrow", event.target.value)}
            onBlur={() => touchField("eyebrow")}
            placeholder={t("placeholders.eyebrow")}
            disabled={saving || !loaded}
          />

          <div className="admin-form-grid__full">
            <AdminFormTextarea
              id={bodyId}
              label={t("fields.body")}
              value={form.body}
              onChange={(event) => updateField("body", event.target.value)}
              onBlur={() => touchField("body")}
              placeholder={t("placeholders.body")}
              disabled={saving || !loaded}
              rows={4}
            />
          </div>

          <div className="admin-banner-form__upload admin-form-grid__full">
            <AdminFormImageUpload
              id="banner-image"
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
            onClick={() => router.push(ROUTES.admin.banners.listing)}
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
