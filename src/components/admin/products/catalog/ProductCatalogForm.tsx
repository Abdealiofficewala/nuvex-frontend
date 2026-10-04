"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { AdminCheckbox } from "@/components/admin/common/AdminCheckbox";
import { AdminFormField } from "@/components/admin/common/AdminFormField";
import {
  AdminFormImageUpload,
  AdminFormMultiSelectDropdown,
  AdminFormPageActions,
} from "@/components/admin/common";
import { AdminFormSelect } from "@/components/admin/common/AdminFormSelect";
import { AdminFormTextarea } from "@/components/admin/common/AdminFormTextarea";
import { Button } from "@/components/ui/buttons";
import { useToast } from "@/components/ui/toast";
import { normalizeSlug } from "@/lib/appearance/slug";
import { ROUTES, productCatalogViewHref } from "@/lib/constants";
import { productCatalogData } from "@/lib/products/catalog-data";
import { isProductFormValid, validateProductForm } from "@/lib/products/validations";
import { shouldShowFieldErrorMessage } from "@/lib/validations/common";
import type {
  CatalogProduct,
  CatalogProductInput,
  CatalogMeta,
  CatalogRef,
  ProductAttribute,
  ProductDocument,
  ProductDocumentType,
  ProductMaterial,
  ProductType,
  ProductVariant,
  SpecificationFieldKey,
} from "@/types/product-catalog";

type ProductCatalogFormProps = {
  editId?: string;
};

const EMPTY_PRODUCT: CatalogProductInput = {
  productCode: "",
  slug: "",
  name: "",
  category: { id: "", name: "", slug: "" },
  type: { id: "", name: "", slug: "" },
  status: "active",
  isNew: false,
  shortDescription: "",
  description: "",
  features: [],
  specifications: { productAttributes: [] },
  variants: [],
  industries: [],
  applications: [],
  media: { thumbnail: null, images: [], technicalDrawings: [] },
  documents: [],
  relationships: { relatedProducts: [], compatibleProducts: [], accessories: [] },
  seo: { metaTitle: "", metaDescription: "", keywords: [], canonical: "" },
};

function createEmptyDocument(): ProductDocument {
  return {
    id: `doc-${crypto.randomUUID().slice(0, 8)}`,
    type: "datasheet",
    title: "",
    url: "",
  };
}

const DOCUMENT_TYPES: ProductDocumentType[] = [
  "datasheet",
  "technical-specification",
  "certificate",
  "manual",
  "catalog",
];

function createEmptyVariant(): ProductVariant {
  return {
    id: `var-${crypto.randomUUID().slice(0, 8)}`,
    sku: "",
    partNumber: "",
    sizeId: "",
    sizeName: "",
    materialId: "",
    materialName: "",
    gradeId: "",
    gradeName: "",
    standardId: "",
    standardName: "",
    finishId: "",
    finishName: "",
    threadId: "",
    threadName: "",
    packagingId: "",
    packagingName: "",
    availability: "in-stock",
    status: "active",
  };
}

export function ProductCatalogForm({ editId }: ProductCatalogFormProps) {
  const isEdit = Boolean(editId);
  const t = useTranslations(`admin.products.catalog.${isEdit ? "edit" : "create"}`);
  const toast = useToast();
  const router = useRouter();
  const [form, setForm] = useState<CatalogProductInput>(EMPTY_PRODUCT);
  const [featuresText, setFeaturesText] = useState("");
  const [keywordsText, setKeywordsText] = useState("");
  const [categories, setCategories] = useState<CatalogRef[]>([]);
  const [types, setTypes] = useState<ProductType[]>([]);
  const [allProducts, setAllProducts] = useState<CatalogProduct[]>([]);
  const [masters, setMasters] = useState({
    sizes: [] as CatalogRef[],
    materials: [] as Array<CatalogRef & { allowedGradeIds: string[] }>,
    grades: [] as CatalogRef[],
    standards: [] as CatalogRef[],
    finishes: [] as CatalogRef[],
    threads: [] as CatalogRef[],
    packaging: [] as CatalogRef[],
    industries: [] as CatalogRef[],
    applications: [] as CatalogRef[],
    headTypes: [] as CatalogRef[],
    driveTypes: [] as CatalogRef[],
    attributes: [] as ProductAttribute[],
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(!isEdit);

  useEffect(() => {
    void Promise.all([
      productCatalogData.listMasterRecords("categories"),
      productCatalogData.listMasterRecords<ProductType>("types"),
      productCatalogData.listProducts(),
      productCatalogData.listMasterRecords("sizes"),
      productCatalogData.listMasterRecords("materials"),
      productCatalogData.listMasterRecords("grades"),
      productCatalogData.listMasterRecords("standards"),
      productCatalogData.listMasterRecords("finishes"),
      productCatalogData.listMasterRecords("threads"),
      productCatalogData.listMasterRecords("packaging"),
      productCatalogData.listMasterRecords("industries"),
      productCatalogData.listMasterRecords("applications"),
      productCatalogData.listMasterRecords("head-types"),
      productCatalogData.listMasterRecords("drive-types"),
      productCatalogData.listMasterRecords<ProductAttribute>("attributes"),
    ]).then(([categoryRows, typeRows, products, sizes, materials, grades, standards, finishes, threads, packaging, industries, applications, headTypes, driveTypes, attributes]) => {
      const asRef = (row: CatalogMeta): CatalogRef => row as unknown as CatalogRef;
      setCategories((categoryRows as CatalogMeta[]).map(asRef));
      setTypes(typeRows as ProductType[]);
      setAllProducts(products);
      setMasters({
        sizes: (sizes as CatalogMeta[]).map(asRef),
        materials: (materials as ProductMaterial[]).map((row) => ({
          id: row.id,
          name: row.name,
          slug: row.slug,
          allowedGradeIds: row.allowedGradeIds,
        })),
        grades: (grades as CatalogMeta[]).map(asRef),
        standards: (standards as CatalogMeta[]).map(asRef),
        finishes: (finishes as CatalogMeta[]).map(asRef),
        threads: (threads as CatalogMeta[]).map(asRef),
        packaging: (packaging as CatalogMeta[]).map(asRef),
        industries: (industries as CatalogMeta[]).map(asRef),
        applications: (applications as CatalogMeta[]).map(asRef),
        headTypes: (headTypes as CatalogMeta[]).map(asRef),
        driveTypes: (driveTypes as CatalogMeta[]).map(asRef),
        attributes: attributes as ProductAttribute[],
      });
    });
  }, []);

  useEffect(() => {
    if (!editId) {
      return;
    }

    productCatalogData.getProduct(editId).then((product) => {
      if (!product) {
        toast.error(t("notFound.title"), t("notFound.body"));
        router.push(ROUTES.admin.products.root);
        return;
      }

      setForm({ ...product, isNew: product.isNew ?? false });
      setFeaturesText(product.features.join("\n"));
      setKeywordsText(product.seo.keywords.join("\n"));
      setLoaded(true);
    });
  }, [editId, router, t, toast]);

  const selectedType = types.find((type) => type.id === form.type.id);
  const typeConfig = selectedType?.configuration;

  const allowedSizes = useMemo(
    () => masters.sizes.filter((size) => typeConfig?.allowedSizeIds.includes(size.id)),
    [masters.sizes, typeConfig],
  );
  const allowedMaterials = useMemo(
    () => masters.materials.filter((material) => typeConfig?.allowedMaterialIds.includes(material.id)),
    [masters.materials, typeConfig],
  );

  const allowedHeadTypes = useMemo(
    () => masters.headTypes.filter((item) => typeConfig?.allowedHeadTypeIds.includes(item.id)),
    [masters.headTypes, typeConfig],
  );
  const allowedDriveTypes = useMemo(
    () => masters.driveTypes.filter((item) => typeConfig?.allowedDriveTypeIds.includes(item.id)),
    [masters.driveTypes, typeConfig],
  );

  const errors = useMemo(() => {
    const next = validateProductForm(form, typeConfig);
    if (editId) {
      const refs = [
        ...form.relationships.relatedProducts,
        ...form.relationships.compatibleProducts,
        ...form.relationships.accessories,
      ];
      if (refs.includes(editId)) {
        next.relationships = "selfReference";
      }
    }
    return next;
  }, [editId, form, typeConfig]);

  const valid = isProductFormValid(errors);

  function renderSpecificationField(field: SpecificationFieldKey) {
    if (field === "headType") {
      return (
        <AdminFormSelect
          key={field}
          id={`spec-${field}`}
          label={t(`specFields.${field}`)}
          value={String(form.specifications[field] ?? "")}
          onChange={(value) =>
            setForm((c) => ({
              ...c,
              specifications: { ...c.specifications, [field]: value },
            }))
          }
          options={[
            { value: "", label: t("placeholders.select") },
            ...allowedHeadTypes.map((item) => ({ value: item.id, label: item.name })),
          ]}
        />
      );
    }

    if (field === "driveType") {
      return (
        <AdminFormSelect
          key={field}
          id={`spec-${field}`}
          label={t(`specFields.${field}`)}
          value={String(form.specifications[field] ?? "")}
          onChange={(value) =>
            setForm((c) => ({
              ...c,
              specifications: { ...c.specifications, [field]: value },
            }))
          }
          options={[
            { value: "", label: t("placeholders.select") },
            ...allowedDriveTypes.map((item) => ({ value: item.id, label: item.name })),
          ]}
        />
      );
    }

    return (
      <AdminFormField
        key={field}
        id={`spec-${field}`}
        label={t(`specFields.${field}`)}
        value={String(form.specifications[field] ?? "")}
        onChange={(event) =>
          setForm((c) => ({
            ...c,
            specifications: { ...c.specifications, [field]: event.target.value },
          }))
        }
      />
    );
  }

  function updateVariant(index: number, patch: Partial<ProductVariant>) {
    setForm((current) => {
      const variants = [...current.variants];
      variants[index] = { ...variants[index], ...patch };
      return { ...current, variants };
    });
  }

  function resolveRef(list: CatalogRef[], id: string): CatalogRef {
    const match = list.find((item) => item.id === id);
    return match ?? { id, name: id, slug: id };
  }

  function gradeOptionsForMaterial(materialId: string): CatalogRef[] {
    const material = masters.materials.find((entry) => entry.id === materialId);
    if (!material) {
      return masters.grades;
    }
    return masters.grades.filter((grade) => material.allowedGradeIds.includes(grade.id));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setTouched({ name: true, productCode: true, slug: true, category: true, type: true });

    if (!valid) {
      toast.error(t("errors.title"), t("errors.validation"));
      return;
    }

    const payload: CatalogProductInput = {
      ...form,
      slug: normalizeSlug(form.slug),
      productCode: form.productCode.trim(),
      name: form.name.trim(),
      features: featuresText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      seo: {
        ...form.seo,
        keywords: keywordsText
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
      },
    };

    setSaving(true);
    try {
      if (isEdit && editId) {
        await productCatalogData.updateProduct(editId, payload);
        toast.success(t("success.title"), t("success.body"));
        router.push(productCatalogViewHref(editId));
      } else {
        const created = await productCatalogData.createProduct(payload);
        toast.success(t("success.title"), t("success.body"));
        router.push(productCatalogViewHref(created.id));
      }
    } catch (error) {
      toast.error(t("errors.title"), error instanceof Error ? error.message : t("errors.generic"));
    } finally {
      setSaving(false);
    }
  }

  if (!loaded) {
    return <p className="admin-loading-hint">{t("loading")}</p>;
  }

  const relationshipOptions = allProducts.filter((product) => product.id !== editId);

  const relationshipSelectOptions = relationshipOptions.map((product) => ({
    value: product.id,
    label: product.name,
  }));

  return (
    <form className="admin-create-form admin-product-catalog-form" onSubmit={(event) => void handleSubmit(event)}>
      <div className="admin-panel admin-product-catalog-form__panel">
      <section className="admin-form-section admin-product-catalog-form__section">
        <h2 className="admin-form-section__title">{t("sections.basic")}</h2>
        <div className="admin-form-grid admin-form-grid--2">
          <AdminFormField
            id="product-name"
            label={t("fields.name")}
            required
            value={form.name}
            onChange={(event) => setForm((c) => ({ ...c, name: event.target.value }))}
            fieldError={shouldShowFieldErrorMessage(touched.name ? errors.name : undefined) ? errors.name : undefined}
            errorMessage={errors.name ? t("errors.required") : null}
          />
          <AdminFormField
            id="product-code"
            label={t("fields.productCode")}
            required
            value={form.productCode}
            onChange={(event) => setForm((c) => ({ ...c, productCode: event.target.value }))}
          />
          <AdminFormField id="product-slug" label={t("fields.slug")} required value={form.slug} onChange={(event) => setForm((c) => ({ ...c, slug: event.target.value }))} />
          <AdminFormSelect
            id="product-category"
            label={t("fields.category")}
            required
            value={form.category.id}
            onChange={(value) => {
              const category = resolveRef(categories, value);
              setForm((c) => ({ ...c, category }));
            }}
            options={categories.map((category) => ({ value: category.id, label: category.name }))}
          />
          <AdminFormSelect
            id="product-type"
            label={t("fields.type")}
            required
            value={form.type.id}
            onChange={(value) => {
              const type = types.find((entry) => entry.id === value);
              if (!type) {
                return;
              }
              setForm((c) => ({
                ...c,
                type: { id: type.id, name: type.name, slug: type.slug },
                specifications: { productAttributes: [] },
                variants: [],
              }));
            }}
            options={types.map((type) => ({ value: type.id, label: type.name }))}
          />
          <AdminFormSelect
            id="product-status"
            label={t("fields.status")}
            value={form.status}
            onChange={(value) => setForm((c) => ({ ...c, status: value as CatalogProductInput["status"] }))}
            options={[
              { value: "active", label: t("status.active") },
              { value: "draft", label: t("status.draft") },
              { value: "archived", label: t("status.archived") },
            ]}
          />
        </div>
        <div className="admin-product-form-options admin-product-form-options--single">
          <div className="admin-product-form-option admin-product-form-option--stacked">
            <AdminCheckbox
              id="product-is-new"
              label={t("fields.isNewTag")}
              showLabel
              checked={form.isNew}
              onChange={(checked) => setForm((c) => ({ ...c, isNew: checked }))}
            />
            <p className="admin-product-form-option__hint">{t("sections.newTagDescription")}</p>
          </div>
        </div>
      </section>

      <section className="admin-form-section admin-product-catalog-form__section">
        <h2 className="admin-form-section__title">{t("sections.content")}</h2>
        <AdminFormField id="product-short" label={t("fields.shortDescription")} value={form.shortDescription} onChange={(event) => setForm((c) => ({ ...c, shortDescription: event.target.value }))} />
        <AdminFormTextarea id="product-description" label={t("fields.description")} value={form.description} onChange={(event) => setForm((c) => ({ ...c, description: event.target.value }))} />
        <AdminFormTextarea id="product-features" label={t("fields.features")} value={featuresText} onChange={(event) => setFeaturesText(event.target.value)} placeholder={t("placeholders.listLines")} />
      </section>

      {typeConfig ? (
        <section className="admin-form-section admin-product-catalog-form__section">
          <h2 className="admin-form-section__title">{t("sections.specifications")}</h2>
          <div className="admin-form-grid admin-form-grid--2">
            {typeConfig.specificationFields.map((field) => renderSpecificationField(field))}
          </div>
          <AdminFormSelect
            id="product-attribute-add"
            label={t("fields.productAttributes")}
            value=""
            onChange={(value) => {
              const attribute = masters.attributes.find((item) => item.id === value);
              if (!attribute || form.specifications.productAttributes.some((item) => item.attributeId === attribute.id)) {
                return;
              }
              setForm((c) => ({
                ...c,
                specifications: {
                  ...c.specifications,
                  productAttributes: [
                    ...c.specifications.productAttributes,
                    { attributeId: attribute.id, attributeName: attribute.name, value: "" },
                  ],
                },
              }));
            }}
            options={[
              { value: "", label: t("placeholders.select") },
              ...masters.attributes
                .filter((item) => item.status === "active")
                .map((item) => ({ value: item.id, label: item.name })),
            ]}
          />
          {form.specifications.productAttributes.map((entry, index) => {
            const attribute = masters.attributes.find((item) => item.id === entry.attributeId);
            if (!attribute) {
              return null;
            }
            const valueKey = `attr-${entry.attributeId}`;
            if (attribute.valueType === "boolean") {
              return (
                <AdminCheckbox
                  key={valueKey}
                  id={valueKey}
                  label={attribute.name}
                  checked={Boolean(entry.value)}
                  onChange={(checked) =>
                    setForm((c) => {
                      const productAttributes = [...c.specifications.productAttributes];
                      productAttributes[index] = { ...entry, value: checked };
                      return { ...c, specifications: { ...c.specifications, productAttributes } };
                    })
                  }
                />
              );
            }
            if (attribute.valueType === "select") {
              return (
                <AdminFormSelect
                  key={valueKey}
                  id={valueKey}
                  label={attribute.name}
                  value={String(entry.value ?? "")}
                  onChange={(value) =>
                    setForm((c) => {
                      const productAttributes = [...c.specifications.productAttributes];
                      productAttributes[index] = { ...entry, value };
                      return { ...c, specifications: { ...c.specifications, productAttributes } };
                    })
                  }
                  options={[
                    { value: "", label: t("placeholders.select") },
                    ...attribute.options.map((option) => ({ value: option, label: option })),
                  ]}
                />
              );
            }
            return (
              <AdminFormField
                key={valueKey}
                id={valueKey}
                label={attribute.name}
                type={attribute.valueType === "number" ? "number" : "text"}
                value={String(entry.value ?? "")}
                onChange={(event) =>
                  setForm((c) => {
                    const productAttributes = [...c.specifications.productAttributes];
                    const raw = event.target.value;
                    productAttributes[index] = {
                      ...entry,
                      value: attribute.valueType === "number" ? Number(raw) : raw,
                    };
                    return { ...c, specifications: { ...c.specifications, productAttributes } };
                  })
                }
              />
            );
          })}
        </section>
      ) : null}

      <section className="admin-form-section admin-product-catalog-form__section">
        <h2 className="admin-form-section__title">{t("sections.variants")}</h2>
        {form.variants.map((variant, index) => (
          <div key={variant.id} className="admin-form-section__group admin-variant-row">
            <div className="admin-form-grid admin-form-grid--3">
              <AdminFormField id={`variant-sku-${index}`} label={t("fields.sku")} value={variant.sku} onChange={(event) => updateVariant(index, { sku: event.target.value })} />
              <AdminFormField id={`variant-part-${index}`} label={t("fields.partNumber")} value={variant.partNumber} onChange={(event) => updateVariant(index, { partNumber: event.target.value })} />
              {typeConfig?.variantAttributes.includes("size") ? (
                <AdminFormSelect
                  id={`variant-size-${index}`}
                  label={t("fields.size")}
                  value={variant.sizeId}
                  onChange={(value) => {
                    const ref = resolveRef(allowedSizes, value);
                    updateVariant(index, { sizeId: ref.id, sizeName: ref.name });
                  }}
                  options={allowedSizes.map((size) => ({ value: size.id, label: size.name }))}
                />
              ) : null}
              {typeConfig?.variantAttributes.includes("material") ? (
                <AdminFormSelect
                  id={`variant-material-${index}`}
                  label={t("fields.material")}
                  value={variant.materialId}
                  onChange={(value) => {
                    const ref = resolveRef(allowedMaterials, value);
                    updateVariant(index, { materialId: ref.id, materialName: ref.name, gradeId: "", gradeName: "" });
                  }}
                  options={allowedMaterials.map((material) => ({ value: material.id, label: material.name }))}
                />
              ) : null}
              {typeConfig?.variantAttributes.includes("grade") ? (
                <AdminFormSelect
                  id={`variant-grade-${index}`}
                  label={t("fields.grade")}
                  value={variant.gradeId}
                  onChange={(value) => {
                    const options = gradeOptionsForMaterial(variant.materialId);
                    const ref = resolveRef(options, value);
                    updateVariant(index, { gradeId: ref.id, gradeName: ref.name });
                  }}
                  options={gradeOptionsForMaterial(variant.materialId).map((grade) => ({ value: grade.id, label: grade.name }))}
                />
              ) : null}
              {typeConfig?.variantAttributes.includes("standard") ? (
                <AdminFormSelect
                  id={`variant-standard-${index}`}
                  label={t("fields.standard")}
                  value={variant.standardId}
                  onChange={(value) => {
                    const ref = resolveRef(masters.standards, value);
                    updateVariant(index, { standardId: ref.id, standardName: ref.name });
                  }}
                  options={masters.standards.map((standard) => ({ value: standard.id, label: standard.name }))}
                />
              ) : null}
              {typeConfig?.variantAttributes.includes("finish") ? (
                <AdminFormSelect
                  id={`variant-finish-${index}`}
                  label={t("fields.finish")}
                  value={variant.finishId}
                  onChange={(value) => {
                    const ref = resolveRef(masters.finishes, value);
                    updateVariant(index, { finishId: ref.id, finishName: ref.name });
                  }}
                  options={masters.finishes.map((finish) => ({ value: finish.id, label: finish.name }))}
                />
              ) : null}
              {typeConfig?.variantAttributes.includes("thread") ? (
                <AdminFormSelect
                  id={`variant-thread-${index}`}
                  label={t("fields.thread")}
                  value={variant.threadId}
                  onChange={(value) => {
                    const ref = resolveRef(masters.threads, value);
                    updateVariant(index, { threadId: ref.id, threadName: ref.name });
                  }}
                  options={masters.threads.map((thread) => ({ value: thread.id, label: thread.name }))}
                />
              ) : null}
              {typeConfig?.variantAttributes.includes("packaging") ? (
                <AdminFormSelect
                  id={`variant-packaging-${index}`}
                  label={t("fields.packaging")}
                  value={variant.packagingId}
                  onChange={(value) => {
                    const ref = resolveRef(masters.packaging, value);
                    updateVariant(index, { packagingId: ref.id, packagingName: ref.name });
                  }}
                  options={masters.packaging.map((entry) => ({ value: entry.id, label: entry.name }))}
                />
              ) : null}
            </div>
            <div className="admin-variant-row__actions">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  const duplicate = {
                    ...variant,
                    id: `var-${crypto.randomUUID().slice(0, 8)}`,
                    sku: "",
                    partNumber: "",
                  };
                  setForm((c) => {
                    const variants = [...c.variants];
                    variants.splice(index + 1, 0, duplicate);
                    return { ...c, variants };
                  });
                }}
              >
                {t("actions.duplicateVariant")}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setForm((c) => ({ ...c, variants: c.variants.filter((_, i) => i !== index) }))}>
                {t("actions.removeVariant")}
              </Button>
            </div>
          </div>
        ))}
        <Button type="button" variant="secondary" onClick={() => setForm((c) => ({ ...c, variants: [...c.variants, createEmptyVariant()] }))}>
          {t("actions.addVariant")}
        </Button>
      </section>

      <section className="admin-form-section admin-product-catalog-form__section">
        <h2 className="admin-form-section__title">{t("sections.industriesApplications")}</h2>
        <div className="admin-form-grid admin-form-grid--2">
          <AdminFormMultiSelectDropdown
            id="product-industries"
            label={t("fields.industries")}
            values={form.industries.map((item) => item.id)}
            placeholder={t("placeholders.select")}
            emptyMessage={t("industriesApplications.emptyIndustries")}
            selectedLabel={(count) => t("relationships.selectedCount", { count })}
            options={masters.industries.map((item) => ({ value: item.id, label: item.name }))}
            onChange={(values) =>
              setForm((current) => ({
                ...current,
                industries: values.map((id) => resolveRef(masters.industries, id)),
              }))
            }
          />
          <AdminFormMultiSelectDropdown
            id="product-applications"
            label={t("fields.applications")}
            values={form.applications.map((item) => item.id)}
            placeholder={t("placeholders.select")}
            emptyMessage={t("industriesApplications.emptyApplications")}
            selectedLabel={(count) => t("relationships.selectedCount", { count })}
            options={masters.applications.map((item) => ({ value: item.id, label: item.name }))}
            onChange={(values) =>
              setForm((current) => ({
                ...current,
                applications: values.map((id) => resolveRef(masters.applications, id)),
              }))
            }
          />
        </div>
      </section>

      <section className="admin-form-section admin-product-catalog-form__section">
        <h2 className="admin-form-section__title">{t("sections.media")}</h2>
        <AdminFormImageUpload
          id="product-thumbnail"
          label={t("fields.thumbnail")}
          value={form.media.thumbnail?.url ?? ""}
          onChange={(value) =>
            setForm((c) => ({
              ...c,
              media: {
                ...c.media,
                thumbnail: value ? { url: value, alt: c.name } : null,
              },
            }))
          }
          constraints={{ accept: "image/*", maxSizeBytes: 2 * 1024 * 1024 }}
        />
        {form.media.images.map((image, index) => (
          <div key={`image-${index}`} className="admin-form-section__group">
            <AdminFormImageUpload
              id={`product-image-${index}`}
              label={t("fields.galleryImage")}
              value={image.url}
              onChange={(value) =>
                setForm((c) => {
                  const images = [...c.media.images];
                  images[index] = { ...images[index], url: value, alt: c.name };
                  return { ...c, media: { ...c.media, images } };
                })
              }
              constraints={{ accept: "image/*", maxSizeBytes: 2 * 1024 * 1024 }}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                setForm((c) => ({
                  ...c,
                  media: { ...c.media, images: c.media.images.filter((_, i) => i !== index) },
                }))
              }
            >
              {t("actions.removeImage")}
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            setForm((c) => ({
              ...c,
              media: {
                ...c.media,
                images: [...c.media.images, { url: "", alt: c.name }],
              },
            }))
          }
        >
          {t("actions.addImage")}
        </Button>
        {form.media.technicalDrawings.map((drawing, index) => (
          <div key={`drawing-${index}`} className="admin-form-section__group">
            <AdminFormImageUpload
              id={`product-drawing-${index}`}
              label={t("fields.technicalDrawing")}
              value={drawing.url}
              onChange={(value) =>
                setForm((c) => {
                  const technicalDrawings = [...c.media.technicalDrawings];
                  technicalDrawings[index] = { ...technicalDrawings[index], url: value, alt: `${c.name} drawing` };
                  return { ...c, media: { ...c.media, technicalDrawings } };
                })
              }
              constraints={{ accept: "image/*", maxSizeBytes: 2 * 1024 * 1024 }}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                setForm((c) => ({
                  ...c,
                  media: {
                    ...c.media,
                    technicalDrawings: c.media.technicalDrawings.filter((_, i) => i !== index),
                  },
                }))
              }
            >
              {t("actions.removeDrawing")}
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            setForm((c) => ({
              ...c,
              media: {
                ...c.media,
                technicalDrawings: [
                  ...c.media.technicalDrawings,
                  { url: "", alt: `${c.name} drawing` },
                ],
              },
            }))
          }
        >
          {t("actions.addDrawing")}
        </Button>
      </section>

      <section className="admin-form-section admin-product-catalog-form__section">
        <h2 className="admin-form-section__title">{t("sections.documents")}</h2>
        {form.documents.map((document, index) => (
          <div key={document.id} className="admin-form-section__group admin-variant-row">
            <div className="admin-form-grid admin-form-grid--3">
              <AdminFormSelect
                id={`doc-type-${index}`}
                label={t("fields.documentType")}
                value={document.type}
                onChange={(value) =>
                  setForm((c) => {
                    const documents = [...c.documents];
                    documents[index] = { ...documents[index], type: value as ProductDocumentType };
                    return { ...c, documents };
                  })
                }
                options={DOCUMENT_TYPES.map((type) => ({ value: type, label: t(`documentTypes.${type}`) }))}
              />
              <AdminFormField
                id={`doc-title-${index}`}
                label={t("fields.documentTitle")}
                value={document.title}
                onChange={(event) =>
                  setForm((c) => {
                    const documents = [...c.documents];
                    documents[index] = { ...documents[index], title: event.target.value };
                    return { ...c, documents };
                  })
                }
              />
              <AdminFormField
                id={`doc-url-${index}`}
                label={t("fields.documentUrl")}
                value={document.url}
                onChange={(event) =>
                  setForm((c) => {
                    const documents = [...c.documents];
                    documents[index] = { ...documents[index], url: event.target.value };
                    return { ...c, documents };
                  })
                }
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setForm((c) => ({ ...c, documents: c.documents.filter((_, i) => i !== index) }))}
            >
              {t("actions.removeDocument")}
            </Button>
          </div>
        ))}
        <Button type="button" variant="secondary" onClick={() => setForm((c) => ({ ...c, documents: [...c.documents, createEmptyDocument()] }))}>
          {t("actions.addDocument")}
        </Button>
      </section>

      <section className="admin-form-section admin-product-catalog-form__section">
        <h2 className="admin-form-section__title">{t("sections.relationships")}</h2>
        <p className="admin-form-section__body">{t("relationships.lede")}</p>
        <div className="admin-form-grid admin-form-grid--2 admin-product-relationships">
          {(["relatedProducts", "compatibleProducts", "accessories"] as const).map((key) => (
            <AdminFormMultiSelectDropdown
              key={key}
              id={`rel-${key}`}
              label={t(`fields.${key}`)}
              values={form.relationships[key]}
              placeholder={t("placeholders.select")}
              emptyMessage={t("relationships.empty")}
              selectedLabel={(count) => t("relationships.selectedCount", { count })}
              options={relationshipSelectOptions}
              onChange={(values) =>
                setForm((current) => ({
                  ...current,
                  relationships: {
                    ...current.relationships,
                    [key]: values.filter((id) => id !== editId),
                  },
                }))
              }
            />
          ))}
        </div>
      </section>

      <section className="admin-form-section admin-product-catalog-form__section">
        <h2 className="admin-form-section__title">{t("sections.seo")}</h2>
        <AdminFormField id="seo-title" label={t("fields.metaTitle")} value={form.seo.metaTitle} onChange={(event) => setForm((c) => ({ ...c, seo: { ...c.seo, metaTitle: event.target.value } }))} />
        <AdminFormTextarea id="seo-description" label={t("fields.metaDescription")} value={form.seo.metaDescription} onChange={(event) => setForm((c) => ({ ...c, seo: { ...c.seo, metaDescription: event.target.value } }))} />
        <AdminFormTextarea id="seo-keywords" label={t("fields.keywords")} value={keywordsText} onChange={(event) => setKeywordsText(event.target.value)} placeholder={t("placeholders.listLines")} />
        <AdminFormField id="seo-canonical" label={t("fields.canonical")} value={form.seo.canonical} onChange={(event) => setForm((c) => ({ ...c, seo: { ...c.seo, canonical: event.target.value } }))} />
      </section>

      <AdminFormPageActions
        cancelHref={ROUTES.admin.products.root}
        cancelLabel={t("cancelAction")}
        submitLabel={t("save")}
        savingLabel={t("saving")}
        saving={saving}
        submitDisabled={!valid}
      />
      </div>
    </form>
  );
}
