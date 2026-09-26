"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { AdminCheckbox } from "@/components/admin/common/AdminCheckbox";
import { AdminFormField } from "@/components/admin/common/AdminFormField";
import { AdminFormSelect } from "@/components/admin/common/AdminFormSelect";
import { AdminFormTextarea } from "@/components/admin/common/AdminFormTextarea";
import { AdminFormImageUpload } from "@/components/admin/common";
import { ProductSizeOptionsEditor } from "@/components/admin/products/ProductSizeOptionsEditor";
import { Button, ButtonLink } from "@/components/ui/buttons";
import { useToast } from "@/components/ui/toast";
import { normalizeSlug } from "@/lib/appearance/slug";
import { categoryHasType } from "@/lib/product-type-utils";
import { ROUTES, productViewHref } from "@/lib/constants";
import {
  createEmptySizeOption,
  normalizeSizeOptions,
  resolveProductListingImage,
} from "@/lib/product-size-options";
import {
  isProductFormValid,
  joinLines,
  parseLines,
  validateProductInput,
  type ContentErrorKey,
} from "@/lib/validations/content";
import { contentService } from "@/services/content.service";
import type { CategoryRecord, ProductInput, ProductRecord, ProductTypeRecord } from "@/types/content-admin";
import type { ProductSizeOption, ProductStatus } from "@/types/product";

type ProductField = keyof ProductInput;

type ProductFormProps = {
  editId?: string;
};

const EMPTY_FORM: ProductInput = {
  slug: "",
  name: "",
  category: "",
  categorySlug: "",
  subcategory: "",
  subcategorySlug: "",
  sizeOptions: [createEmptySizeOption(true)],
  shortDescription: "",
  description: "",
  image: "",
  gallery: [],
  features: [],
  specifications: [],
  applications: [],
  materials: [],
  keySpec: "",
  isFeatured: false,
  status: "active",
};

export function ProductForm({ editId }: ProductFormProps) {
  const isEdit = Boolean(editId);
  const t = useTranslations(isEdit ? "admin.products.listing.edit" : "admin.products.listing.create");
  const toast = useToast();
  const router = useRouter();
  const nameId = useId();
  const slugId = useId();
  const [form, setForm] = useState<ProductInput>(EMPTY_FORM);
  const [featuresText, setFeaturesText] = useState("");
  const [applicationsText, setApplicationsText] = useState("");
  const [materialsText, setMaterialsText] = useState("");
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [productTypes, setProductTypes] = useState<ProductTypeRecord[]>([]);
  const [touchedFields, setTouchedFields] = useState<Partial<Record<ProductField, boolean>>>({});
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(!isEdit);
  const [existing, setExisting] = useState<ProductRecord | null>(null);

  useEffect(() => {
    contentService.listCategories().then(setCategories).catch(() => setCategories([]));
    contentService.listProductTypes().then(setProductTypes).catch(() => setProductTypes([]));
  }, []);

  useEffect(() => {
    if (!isEdit || !editId) {
      return;
    }

    contentService
      .getProduct(editId)
      .then((product) => {
        setExisting(product);
        setForm({
          slug: product.slug,
          name: product.name,
          category: product.category,
          categorySlug: product.categorySlug,
          subcategory: product.subcategory,
          subcategorySlug: product.subcategorySlug,
          sizeOptions: product.sizeOptions?.length ? product.sizeOptions : [createEmptySizeOption(true)],
          shortDescription: product.shortDescription,
          description: product.description,
          image: product.image,
          gallery: product.gallery,
          features: product.features,
          specifications: product.specifications,
          applications: product.applications,
          materials: product.materials,
          keySpec: product.keySpec,
          isFeatured: product.isFeatured,
          status: product.status,
        });
        setFeaturesText(joinLines(product.features));
        setApplicationsText(joinLines(product.applications));
        setMaterialsText(joinLines(product.materials));
      })
      .catch(() => setExisting(null))
      .finally(() => setLoaded(true));
  }, [editId, isEdit]);

  const categoryOptions = useMemo(
    () => categories.map((item) => ({ label: item.name, value: item.slug })),
    [categories],
  );

  const typeOptions = useMemo(() => {
    const category = categories.find((item) => item.slug === form.categorySlug);
    const filtered = category
      ? productTypes.filter((item) => categoryHasType(category, item.slug))
      : [];
    return filtered.map((item) => ({ label: item.name, value: item.slug }));
  }, [categories, form.categorySlug, productTypes]);

  const statusOptions = [
    { label: t("fields.statusActive"), value: "active" },
    { label: t("fields.statusLimited"), value: "limited" },
    { label: t("fields.statusArchived"), value: "archived" },
  ];

  const payload: ProductInput = {
    ...form,
    features: parseLines(featuresText),
    applications: parseLines(applicationsText),
    materials: parseLines(materialsText),
  };

  const fieldErrors = validateProductInput(payload, categories, productTypes);
  const canSave = loaded && isProductFormValid(fieldErrors);

  function touchField(field: ProductField) {
    setTouchedFields((current) => ({ ...current, [field]: true }));
  }

  function touchAllFields() {
    setTouchedFields({
      slug: true,
      name: true,
      category: true,
      categorySlug: true,
      subcategorySlug: true,
      shortDescription: true,
      image: true,
      sizeOptions: true,
      status: true,
    });
  }

  function getVisibleFieldError(field: ProductField): ContentErrorKey | undefined {
    if (!touchedFields[field]) {
      return undefined;
    }

    return fieldErrors[field];
  }

  function getFieldErrorMessage(errorKey: string) {
    return t(`errors.${errorKey}` as "errors.required");
  }

  function updateField<K extends ProductField>(field: K, value: ProductInput[K]) {
    touchField(field);
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSizeOptionsChange(next: ProductSizeOption[]) {
    touchField("sizeOptions");
    const listingImage = resolveProductListingImage(next, form.image);
    setForm((current) => ({
      ...current,
      sizeOptions: next,
      image: listingImage || current.image,
    }));
  }

  function handleCategoryChange(categorySlug: string) {
    const category = categories.find((item) => item.slug === categorySlug);
    touchField("categorySlug");
    setForm((current) => ({
      ...current,
      categorySlug,
      category: category?.name ?? current.category,
      subcategory: "",
      subcategorySlug: "",
    }));
  }

  function handleTypeChange(typeSlug: string) {
    const category = categories.find((item) => item.slug === form.categorySlug);
    const productType = productTypes.find(
      (item) => item.slug === typeSlug && category && categoryHasType(category, item.slug),
    );
    touchField("subcategorySlug");
    setForm((current) => ({
      ...current,
      subcategorySlug: typeSlug,
      subcategory: productType?.name ?? "",
    }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    touchAllFields();

    const normalizedSizeOptions = normalizeSizeOptions(form.sizeOptions, form.image, form.gallery ?? []);
    const listingImage = resolveProductListingImage(normalizedSizeOptions, form.image);

    const submitPayload: ProductInput = {
      ...form,
      slug: normalizeSlug(form.slug || form.name),
      name: form.name.trim(),
      shortDescription: form.shortDescription.trim(),
      description: form.description.trim(),
      subcategory: form.subcategory.trim(),
      subcategorySlug: normalizeSlug(form.subcategorySlug || form.subcategory),
      keySpec: form.keySpec.trim(),
      sizeOptions: normalizedSizeOptions,
      image: listingImage,
      features: parseLines(featuresText),
      applications: parseLines(applicationsText),
      materials: parseLines(materialsText),
    };

    if (!isProductFormValid(validateProductInput(submitPayload, categories, productTypes))) {
      toast.error(t("errors.title"), t("errors.validation"));
      return;
    }

    setSaving(true);

    try {
      if (isEdit && editId) {
        const updated = await contentService.updateProduct(editId, submitPayload);
        toast.success(t("success.title"), t("success.body"));
        router.push(productViewHref(updated.id));
        return;
      }

      await contentService.createProduct(submitPayload);
      toast.success(t("success.title"), t("success.body"));
      router.push(ROUTES.admin.products.listing);
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
        <ButtonLink href={ROUTES.admin.products.listing} variant="secondary">
          {t("cancelAction")}
        </ButtonLink>
      </div>
    );
  }

  return (
    <form className="admin-product-form admin-create-form" onSubmit={onSubmit} noValidate>
      <div className="admin-panel admin-product-form__panel">
        <div className="admin-product-form__body admin-form-grid admin-form-grid--2">
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
            id="product-category"
            label={t("fields.category")}
            required
            value={form.categorySlug}
            options={categoryOptions}
            placeholder={t("placeholders.category")}
            fieldError={getVisibleFieldError("categorySlug")}
            getErrorMessage={getFieldErrorMessage}
            onChange={handleCategoryChange}
            onBlur={() => touchField("categorySlug")}
            disabled={saving || !loaded || categoryOptions.length === 0}
          />

          <AdminFormSelect
            id="product-status"
            label={t("fields.status")}
            value={form.status}
            options={statusOptions}
            onChange={(value) => updateField("status", value as ProductStatus)}
            onBlur={() => touchField("status")}
            disabled={saving || !loaded}
          />

          <AdminFormSelect
            id="product-subcategory"
            label={t("fields.subcategory")}
            value={form.subcategorySlug}
            options={typeOptions}
            placeholder={t("placeholders.subcategory")}
            fieldError={getVisibleFieldError("subcategorySlug")}
            getErrorMessage={getFieldErrorMessage}
            onChange={handleTypeChange}
            onBlur={() => touchField("subcategorySlug")}
            disabled={saving || !loaded || !form.categorySlug || typeOptions.length === 0}
          />

          <AdminFormField
            id="product-key-spec"
            label={t("fields.keySpec")}
            value={form.keySpec}
            onChange={(event) => updateField("keySpec", event.target.value)}
            placeholder={t("placeholders.keySpec")}
            disabled={saving || !loaded}
          />

          <div className="admin-form-grid__full">
            <AdminFormTextarea
              id="product-short-description"
              label={t("fields.shortDescription")}
              required
              fieldError={getVisibleFieldError("shortDescription")}
              getErrorMessage={getFieldErrorMessage}
              value={form.shortDescription}
              onChange={(event) => updateField("shortDescription", event.target.value)}
              onBlur={() => touchField("shortDescription")}
              placeholder={t("placeholders.shortDescription")}
              disabled={saving || !loaded}
              rows={2}
            />
          </div>

          <div className="admin-form-grid__full">
            <AdminFormTextarea
              id="product-description"
              label={t("fields.description")}
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              placeholder={t("placeholders.description")}
              disabled={saving || !loaded}
              rows={4}
            />
          </div>

          <ProductSizeOptionsEditor
            value={form.sizeOptions ?? []}
            onChange={handleSizeOptionsChange}
            onBlur={() => touchField("sizeOptions")}
            disabled={saving || !loaded}
            fieldError={getVisibleFieldError("sizeOptions")}
            getErrorMessage={getFieldErrorMessage}
            labels={{
              title: t("fields.sizeOptions"),
              add: t("sizeOptions.add"),
              remove: t("sizeOptions.remove"),
              default: t("sizeOptions.default"),
              sizeLabel: t("sizeOptions.label"),
              sizePlaceholder: t("sizeOptions.placeholder"),
              imageLabel: t("sizeOptions.image"),
            }}
          />

          <AdminFormTextarea
            id="product-features"
            label={t("fields.features")}
            value={featuresText}
            onChange={(event) => setFeaturesText(event.target.value)}
            placeholder={t("placeholders.listLines")}
            disabled={saving || !loaded}
            rows={4}
          />

          <AdminFormTextarea
            id="product-applications"
            label={t("fields.applications")}
            value={applicationsText}
            onChange={(event) => setApplicationsText(event.target.value)}
            placeholder={t("placeholders.listLines")}
            disabled={saving || !loaded}
            rows={3}
          />

          <AdminFormTextarea
            id="product-materials"
            label={t("fields.materials")}
            value={materialsText}
            onChange={(event) => setMaterialsText(event.target.value)}
            placeholder={t("placeholders.listLines")}
            disabled={saving || !loaded}
            rows={3}
          />

          <div className="admin-form-grid__full">
            <AdminCheckbox
              id="product-featured"
              checked={form.isFeatured}
              label={t("fields.isFeatured")}
              showLabel
              onChange={(checked) => updateField("isFeatured", checked)}
              disabled={saving || !loaded}
            />
          </div>

          <div className="admin-form-grid__full">
            <AdminFormImageUpload
              id="product-image"
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
            <p className="admin-field-hint">{t("fields.imageHint")}</p>
          </div>
        </div>

        <div className="admin-page-actions admin-page-actions--form">
          <Button
            type="button"
            variant="secondary"
            className="admin-page-actions__btn admin-page-actions__btn--reset"
            disabled={saving}
            onClick={() => router.push(ROUTES.admin.products.listing)}
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
