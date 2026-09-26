"use client";

import { useEffect, useId, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import {
  AdminFormField,
  AdminFormImageUpload,
  AdminFormSwitch,
  AdminFormTextarea,
} from "@/components/admin/common";
import { Button, ButtonLink } from "@/components/ui/buttons";
import { useToast } from "@/components/ui/toast";
import { normalizeSlug } from "@/lib/appearance/slug";
import { ROUTES, typeViewHref } from "@/lib/constants";
import {
  isProductTypeFormValid,
  validateProductTypeInput,
  type ContentErrorKey,
} from "@/lib/validations/content";
import { contentService } from "@/services/content.service";
import type { ProductTypeInput, ProductTypeRecord } from "@/types/content-admin";

type TypeField = keyof ProductTypeInput;

type TypeFormProps = {
  editId?: string;
};

export function TypeForm({ editId }: TypeFormProps) {
  const isEdit = Boolean(editId);
  const t = useTranslations(isEdit ? "admin.products.types.edit" : "admin.products.types.create");
  const toast = useToast();
  const router = useRouter();
  const nameId = useId();
  const slugId = useId();
  const summaryId = useId();
  const [form, setForm] = useState<ProductTypeInput>({
    slug: "",
    name: "",
    summary: "",
    image: "",
    isVisible: true,
  });
  const [touchedFields, setTouchedFields] = useState<Partial<Record<TypeField, boolean>>>({});
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(!isEdit);
  const [existing, setExisting] = useState<ProductTypeRecord | null>(null);

  useEffect(() => {
    if (!isEdit || !editId) {
      return;
    }

    contentService
      .getProductType(editId)
      .then((productType) => {
        setExisting(productType);
        setForm({
          slug: productType.slug,
          name: productType.name,
          summary: productType.summary,
          image: productType.image ?? "",
          isVisible: productType.isVisible ?? true,
        });
      })
      .catch(() => setExisting(null))
      .finally(() => setLoaded(true));
  }, [editId, isEdit]);

  const fieldErrors = validateProductTypeInput(form);
  const canSave = loaded && isProductTypeFormValid(fieldErrors);

  function touchField(field: TypeField) {
    setTouchedFields((current) => ({ ...current, [field]: true }));
  }

  function touchAllFields() {
    setTouchedFields({ slug: true, name: true, summary: true, image: true, isVisible: true });
  }

  function getVisibleFieldError(field: TypeField): ContentErrorKey | undefined {
    if (!touchedFields[field]) {
      return undefined;
    }

    return fieldErrors[field];
  }

  function getFieldErrorMessage(errorKey: string) {
    return t(`errors.${errorKey}` as "errors.required");
  }

  function updateField<K extends TypeField>(field: K, value: ProductTypeInput[K]) {
    touchField(field);
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    touchAllFields();

    const payload: ProductTypeInput = {
      ...form,
      slug: normalizeSlug(form.slug || form.name),
      name: form.name.trim(),
      summary: form.summary.trim(),
    };

    if (!isProductTypeFormValid(validateProductTypeInput(payload))) {
      toast.error(t("errors.title"), t("errors.validation"));
      return;
    }

    setSaving(true);

    try {
      if (isEdit && editId) {
        const updated = await contentService.updateProductType(editId, payload);
        toast.success(t("success.title"), t("success.body"));
        router.push(typeViewHref(updated.id));
        return;
      }

      await contentService.createProductType(payload);
      toast.success(t("success.title"), t("success.body"));
      router.push(ROUTES.admin.products.types);
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
        <ButtonLink href={ROUTES.admin.products.types} variant="secondary">
          {t("cancelAction")}
        </ButtonLink>
      </div>
    );
  }

  return (
    <form className="admin-type-form admin-create-form" onSubmit={onSubmit} noValidate>
      <div className="admin-panel admin-type-form__panel">
        <div className="admin-type-form__body admin-form-grid admin-form-grid--2">
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
              rows={3}
            />
          </div>

          <AdminFormSwitch
            id="type-is-visible"
            label={t("fields.isVisible")}
            description={t("hints.isVisible")}
            checked={form.isVisible}
            onLabel={t("options.yes")}
            offLabel={t("options.no")}
            onChange={(checked) => updateField("isVisible", checked)}
            onBlur={() => touchField("isVisible")}
            disabled={saving || !loaded}
          />

          <div className="admin-form-grid__full">
            <AdminFormImageUpload
              id="type-image"
              label={t("fields.image")}
              required
              variant="logo"
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
            onClick={() => router.push(ROUTES.admin.products.types)}
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
