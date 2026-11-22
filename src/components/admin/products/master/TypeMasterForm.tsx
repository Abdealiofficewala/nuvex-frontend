"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { AdminFormField } from "@/components/admin/common/AdminFormField";
import { AdminFormImageUpload, AdminFormMultiSelectDropdown, AdminFormPageActions } from "@/components/admin/common";
import { AdminFormSelect } from "@/components/admin/common/AdminFormSelect";
import { AdminFormTextarea } from "@/components/admin/common/AdminFormTextarea";
import { useToast } from "@/components/ui/toast";
import { normalizeSlug } from "@/lib/appearance/slug";
import { productCatalogData } from "@/lib/products/catalog-data";
import { getMasterConfig } from "@/lib/products/master-registry";
import { isMasterFormValid, validateMasterForm } from "@/lib/products/validations";
import { shouldShowFieldErrorMessage } from "@/lib/validations/common";
import type {
  CatalogStatus,
  ProductType,
  ProductTypeConfiguration,
  SpecificationFieldKey,
  VariantAttributeKey,
} from "@/types/product-catalog";

const SPEC_FIELDS: SpecificationFieldKey[] = [
  "headType",
  "driveType",
  "diameter",
  "length",
  "threadPitch",
  "innerDiameter",
  "outerDiameter",
  "thickness",
  "height",
  "widthAcrossFlats",
  "thread",
];

const VARIANT_ATTRS: VariantAttributeKey[] = [
  "size",
  "material",
  "grade",
  "standard",
  "finish",
  "thread",
  "packaging",
];

type TypeMasterFormProps = {
  editId?: string;
};

const EMPTY_CONFIG: ProductTypeConfiguration = {
  specificationFields: [],
  variantAttributes: [],
  allowedSizeIds: [],
  allowedMaterialIds: [],
  allowedGradeIds: [],
  allowedStandardIds: [],
  allowedFinishIds: [],
  allowedThreadIds: [],
  allowedHeadTypeIds: [],
  allowedDriveTypeIds: [],
};

export function TypeMasterForm({ editId }: TypeMasterFormProps) {
  const config = getMasterConfig("types");
  const isEdit = Boolean(editId);
  const t = useTranslations(`admin.products.masters.types.${isEdit ? "edit" : "create"}`);
  const tSelection = useTranslations("admin.products.masters.common.selection");
  const toast = useToast();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    slug: "",
    code: "",
    summary: "",
    image: "",
    status: "active" as CatalogStatus,
    configuration: EMPTY_CONFIG,
  });
  const [masters, setMasters] = useState({
    sizes: [] as Array<{ id: string; name: string }>,
    materials: [] as Array<{ id: string; name: string }>,
    grades: [] as Array<{ id: string; name: string }>,
    standards: [] as Array<{ id: string; name: string }>,
    finishes: [] as Array<{ id: string; name: string }>,
    threads: [] as Array<{ id: string; name: string }>,
    headTypes: [] as Array<{ id: string; name: string }>,
    driveTypes: [] as Array<{ id: string; name: string }>,
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(!isEdit);

  useEffect(() => {
    void Promise.all([
      productCatalogData.listMasterRecords("sizes"),
      productCatalogData.listMasterRecords("materials"),
      productCatalogData.listMasterRecords("grades"),
      productCatalogData.listMasterRecords("standards"),
      productCatalogData.listMasterRecords("finishes"),
      productCatalogData.listMasterRecords("threads"),
      productCatalogData.listMasterRecords("head-types"),
      productCatalogData.listMasterRecords("drive-types"),
    ]).then(([sizes, materials, grades, standards, finishes, threads, headTypes, driveTypes]) => {
      setMasters({
        sizes: sizes as unknown as Array<{ id: string; name: string }>,
        materials: materials as unknown as Array<{ id: string; name: string }>,
        grades: grades as unknown as Array<{ id: string; name: string }>,
        standards: standards as unknown as Array<{ id: string; name: string }>,
        finishes: finishes as unknown as Array<{ id: string; name: string }>,
        threads: threads as unknown as Array<{ id: string; name: string }>,
        headTypes: headTypes as unknown as Array<{ id: string; name: string }>,
        driveTypes: driveTypes as unknown as Array<{ id: string; name: string }>,
      });
    });
  }, []);

  useEffect(() => {
    if (!editId) {
      return;
    }

    productCatalogData.getMasterRecord<ProductType>("types", editId).then((record) => {
      if (!record) {
        toast.error(t("notFound.title"), t("notFound.body"));
        router.push(config.route);
        return;
      }

      setForm({
        name: record.name,
        slug: record.slug,
        code: record.code,
        summary: record.summary,
        image: record.image,
        status: record.status,
        configuration: { ...EMPTY_CONFIG, ...record.configuration },
      });
      setLoaded(true);
    });
  }, [config.route, editId, router, t, toast]);

  const errors = useMemo(() => validateMasterForm("types", form, isEdit), [form, isEdit]);
  const valid = isMasterFormValid(errors);

  function updateConfiguration<K extends keyof ProductTypeConfiguration>(
    key: K,
    value: ProductTypeConfiguration[K],
  ) {
    setForm((current) => ({
      ...current,
      configuration: { ...current.configuration, [key]: value },
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!valid) {
      toast.error(t("errors.title"), t("errors.validation"));
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        slug: normalizeSlug(form.slug),
        code: form.code.trim(),
        summary: form.summary.trim(),
        image: form.image,
        status: form.status,
        configuration: form.configuration,
      };

      if (isEdit && editId) {
        await productCatalogData.updateMasterRecord("types", editId, payload);
      } else {
        await productCatalogData.createMasterRecord("types", payload);
      }

      toast.success(t("success.title"), t("success.body"));
      router.push(config.route);
    } catch (error) {
      toast.error(t("errors.title"), error instanceof Error ? error.message : t("errors.generic"));
    } finally {
      setSaving(false);
    }
  }

  if (!loaded) {
    return <p className="admin-loading-hint">{t("loading")}</p>;
  }

  return (
    <form className="admin-create-form admin-master-form admin-master-form--types" onSubmit={(event) => void handleSubmit(event)}>
      <div className="admin-panel admin-master-form__panel">
      <div className="admin-form-grid admin-form-grid--2">
        <AdminFormField
          id="type-name"
          label={t("fields.name")}
          required
          value={form.name}
          onChange={(event) => setForm((c) => ({ ...c, name: event.target.value }))}
          fieldError={shouldShowFieldErrorMessage(touched.name ? errors.name : undefined) ? errors.name : undefined}
          errorMessage={errors.name ? t("errors.required") : null}
        />
        <AdminFormField
          id="type-slug"
          label={t("fields.slug")}
          required
          value={form.slug}
          onChange={(event) => setForm((c) => ({ ...c, slug: event.target.value }))}
        />
        <AdminFormField id="type-code" label={t("fields.code")} required value={form.code} onChange={(event) => setForm((c) => ({ ...c, code: event.target.value }))} />
        <AdminFormSelect
          id="type-status"
          label={t("fields.status")}
          value={form.status}
          onChange={(value) => setForm((c) => ({ ...c, status: value as CatalogStatus }))}
          options={[
            { value: "active", label: t("status.active") },
            { value: "inactive", label: t("status.inactive") },
          ]}
        />
      </div>

      <AdminFormTextarea id="type-summary" label={t("fields.summary")} value={form.summary} onChange={(event) => setForm((c) => ({ ...c, summary: event.target.value }))} />
      <AdminFormImageUpload id="type-image" label={t("fields.image")} value={form.image} onChange={(value) => setForm((c) => ({ ...c, image: value }))} constraints={{ accept: "image/*", maxSizeBytes: 2 * 1024 * 1024 }} />

      <section className="admin-form-section admin-master-form__section">
        <h2 className="admin-form-section__title">{t("configuration.specificationsTitle")}</h2>
        <AdminFormMultiSelectDropdown
          id="type-specification-fields"
          label={t("configuration.specificationsSelectLabel")}
          values={form.configuration.specificationFields ?? []}
          placeholder={tSelection("placeholder")}
          emptyMessage={tSelection("empty")}
          selectedLabel={(count) => tSelection("selectedCount", { count })}
          options={SPEC_FIELDS.map((field) => ({
            value: field,
            label: t(`configuration.specFields.${field}`),
          }))}
          onChange={(values) =>
            updateConfiguration("specificationFields", values as SpecificationFieldKey[])
          }
        />
      </section>

      <section className="admin-form-section admin-master-form__section">
        <h2 className="admin-form-section__title">{t("configuration.variantTitle")}</h2>
        <AdminFormMultiSelectDropdown
          id="type-variant-attributes"
          label={t("configuration.variantSelectLabel")}
          values={form.configuration.variantAttributes ?? []}
          placeholder={tSelection("placeholder")}
          emptyMessage={tSelection("empty")}
          selectedLabel={(count) => tSelection("selectedCount", { count })}
          options={VARIANT_ATTRS.map((field) => ({
            value: field,
            label: t(`configuration.variantFields.${field}`),
          }))}
          onChange={(values) =>
            updateConfiguration("variantAttributes", values as VariantAttributeKey[])
          }
        />
      </section>

      <section className="admin-form-section admin-master-form__section">
        <h2 className="admin-form-section__title">{t("configuration.allowedTitle")}</h2>
        <div className="admin-form-grid admin-form-grid--2 admin-master-form__allowed">
          {(
            [
              ["allowedSizeIds", masters.sizes],
              ["allowedMaterialIds", masters.materials],
              ["allowedGradeIds", masters.grades],
              ["allowedStandardIds", masters.standards],
              ["allowedFinishIds", masters.finishes],
              ["allowedThreadIds", masters.threads],
              ["allowedHeadTypeIds", masters.headTypes],
              ["allowedDriveTypeIds", masters.driveTypes],
            ] as const
          ).map(([key, options]) => (
            <AdminFormMultiSelectDropdown
              key={key}
              id={`type-${key}`}
              label={t(`configuration.allowed.${key}`)}
              values={(form.configuration[key] as string[]) ?? []}
              placeholder={tSelection("placeholder")}
              emptyMessage={tSelection("empty")}
              selectedLabel={(count) => tSelection("selectedCount", { count })}
              options={options.map((option) => ({ value: option.id, label: option.name }))}
              onChange={(values) => updateConfiguration(key, values)}
            />
          ))}
        </div>
      </section>

      <AdminFormPageActions
        cancelHref={config.route}
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
