"use client";

import { useEffect, useId, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { AdminCheckbox } from "@/components/admin/common/AdminCheckbox";
import { AdminFieldError } from "@/components/admin/common/AdminFieldError";
import { AdminFieldLabel } from "@/components/admin/common/AdminFieldLabel";
import {
  AdminFormField,
  AdminFormImageUpload,
  AdminFormSwitch,
  AdminFormTextarea,
} from "@/components/admin/common";
import { Button, ButtonLink } from "@/components/ui/buttons";
import { useToast } from "@/components/ui/toast";
import { normalizeSlug } from "@/lib/appearance/slug";
import { ROUTES, categoryViewHref } from "@/lib/constants";
import {
  isCategoryFormValid,
  validateCategoryInput,
  type ContentErrorKey,
} from "@/lib/validations/content";
import { contentService } from "@/services/content.service";
import type { CategoryInput, CategoryRecord, ProductTypeRecord } from "@/types/content-admin";

type CategoryField = keyof CategoryInput;

type CategoryFormProps = {
  editId?: string;
};

const EMPTY_FORM: CategoryInput = {
  slug: "",
  name: "",
  summary: "",
  image: "",
  isVisible: true,
  isNew: false,
  typeSlugs: [],
  typeNames: [],
};

export function CategoryForm({ editId }: CategoryFormProps) {
  const isEdit = Boolean(editId);
  const t = useTranslations(isEdit ? "admin.products.categories.edit" : "admin.products.categories.create");
  const tNav = useTranslations("admin.nav");
  const typeLabel = tNav("productTypes");
  const toast = useToast();
  const router = useRouter();
  const nameId = useId();
  const slugId = useId();
  const summaryId = useId();
  const dependenciesId = useId();
  const [form, setForm] = useState<CategoryInput>(EMPTY_FORM);
  const [productTypes, setProductTypes] = useState<ProductTypeRecord[]>([]);
  const [touchedFields, setTouchedFields] = useState<Partial<Record<CategoryField, boolean>>>({});
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(!isEdit);
  const [existing, setExisting] = useState<CategoryRecord | null>(null);

  useEffect(() => {
    contentService.listProductTypes().then(setProductTypes).catch(() => setProductTypes([]));
  }, []);

  useEffect(() => {
    if (!isEdit || !editId) {
      return;
    }

    contentService
      .getCategory(editId)
      .then((category) => {
        setExisting(category);
        setForm({
          slug: category.slug,
          name: category.name,
          summary: category.summary,
          image: category.image,
          isVisible: category.isVisible ?? true,
          isNew: category.isNew ?? false,
          typeSlugs: category.typeSlugs ?? [],
          typeNames: category.typeNames ?? [],
        });
      })
      .catch(() => setExisting(null))
      .finally(() => setLoaded(true));
  }, [editId, isEdit]);

  const fieldErrors = validateCategoryInput(form, productTypes);
  const canSave = loaded && isCategoryFormValid(fieldErrors) && productTypes.length > 0;

  function touchField(field: CategoryField) {
    setTouchedFields((current) => ({ ...current, [field]: true }));
  }

  function touchAllFields() {
    setTouchedFields({
      slug: true,
      name: true,
      summary: true,
      image: true,
      isVisible: true,
      isNew: true,
      typeSlugs: true,
      typeNames: true,
    });
  }

  function getVisibleFieldError(field: CategoryField): ContentErrorKey | undefined {
    if (!touchedFields[field]) {
      return undefined;
    }

    return fieldErrors[field];
  }

  function getFieldErrorMessage(errorKey: string) {
    return t(`errors.${errorKey}` as "errors.required");
  }

  function updateField<K extends CategoryField>(field: K, value: CategoryInput[K]) {
    touchField(field);
    setForm((current) => ({ ...current, [field]: value }));
  }

  function toggleTypeDependency(typeSlug: string, checked: boolean) {
    touchField("typeSlugs");
    const productType = productTypes.find((item) => item.slug === typeSlug);
    setForm((current) => {
      const nextSlugs = checked
        ? [...new Set([...current.typeSlugs, typeSlug])]
        : current.typeSlugs.filter((slug) => slug !== typeSlug);
      const nextNames = nextSlugs.map(
        (slug) => productTypes.find((item) => item.slug === slug)?.name ?? productType?.name ?? slug,
      );

      return {
        ...current,
        typeSlugs: nextSlugs,
        typeNames: nextNames,
      };
    });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    touchAllFields();

    const payload: CategoryInput = {
      ...form,
      slug: normalizeSlug(form.slug),
      name: form.name.trim(),
      summary: form.summary.trim(),
      typeSlugs: form.typeSlugs,
      typeNames: form.typeNames,
    };

    if (!isCategoryFormValid(validateCategoryInput(payload, productTypes))) {
      toast.error(t("errors.title"), t("errors.validation"));
      return;
    }

    setSaving(true);

    try {
      if (isEdit && editId) {
        const updated = await contentService.updateCategory(editId, payload);
        toast.success(t("success.title"), t("success.body"));
        router.push(categoryViewHref(updated.id));
        return;
      }

      await contentService.createCategory(payload);
      toast.success(t("success.title"), t("success.body"));
      router.push(ROUTES.admin.products.categories);
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
        <ButtonLink href={ROUTES.admin.products.categories} variant="secondary">
          {t("cancelAction")}
        </ButtonLink>
      </div>
    );
  }

  const dependencyError = getVisibleFieldError("typeSlugs");

  return (
    <form className="admin-category-form admin-create-form" onSubmit={onSubmit} noValidate>
      <div className="admin-panel admin-category-form__panel">
        <div className="admin-category-form__body admin-form-grid admin-form-grid--2">
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
            required
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
              required
              fieldError={getVisibleFieldError("summary")}
              getErrorMessage={getFieldErrorMessage}
              value={form.summary}
              onChange={(event) => updateField("summary", event.target.value)}
              onBlur={() => touchField("summary")}
              placeholder={t("placeholders.summary")}
              disabled={saving || !loaded}
              rows={3}
            />
          </div>

          <div className="admin-form-grid__full admin-form-field">
            <AdminFieldLabel htmlFor={dependenciesId} required>
              {t("fields.dependencies", { typeLabel })}
            </AdminFieldLabel>
            <p className="admin-form-field__hint">{t("hints.dependencies", { typeLabel })}</p>
            {productTypes.length === 0 ? (
              <p className="admin-form-field__hint">{t("emptyTypes", { typeLabel })}</p>
            ) : (
              <div className="admin-type-filter-grid">
                {productTypes.map((productType) => (
                  <AdminCheckbox
                    key={productType.id}
                    id={`category-type-${productType.slug}`}
                    checked={form.typeSlugs.includes(productType.slug)}
                    label={productType.name}
                    showLabel
                    disabled={saving || !loaded}
                    onChange={(checked) => toggleTypeDependency(productType.slug, checked)}
                  />
                ))}
              </div>
            )}
            <AdminFieldError message={dependencyError ? getFieldErrorMessage(dependencyError) : null} />
          </div>

          <AdminFormSwitch
            id="category-is-visible"
            label={t("fields.isVisible")}
            description={t("hints.isVisible")}
            checked={form.isVisible}
            onLabel={t("options.yes")}
            offLabel={t("options.no")}
            onChange={(checked) => updateField("isVisible", checked)}
            onBlur={() => touchField("isVisible")}
            disabled={saving || !loaded}
          />

          <AdminFormSwitch
            id="category-is-new"
            label={t("fields.isNew")}
            description={t("hints.isNew")}
            checked={form.isNew}
            onLabel={t("options.yes")}
            offLabel={t("options.no")}
            onChange={(checked) => updateField("isNew", checked)}
            onBlur={() => touchField("isNew")}
            disabled={saving || !loaded}
          />

          <div className="admin-form-grid__full">
            <AdminFormImageUpload
              id="category-image"
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
            onClick={() => router.push(ROUTES.admin.products.categories)}
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
