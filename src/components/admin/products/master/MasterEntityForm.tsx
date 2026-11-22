"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { AdminFormField } from "@/components/admin/common/AdminFormField";
import { AdminFormSelect } from "@/components/admin/common/AdminFormSelect";
import { AdminFormTextarea } from "@/components/admin/common/AdminFormTextarea";
import {
  AdminFormImageUpload,
  AdminFormMultiSelectDropdown,
  AdminFormPageActions,
} from "@/components/admin/common";
import { useToast } from "@/components/ui/toast";
import { normalizeSlug } from "@/lib/appearance/slug";
import { productCatalogData } from "@/lib/products/catalog-data";
import { getMasterConfig } from "@/lib/products/master-registry";
import { isMasterFormValid, validateMasterForm } from "@/lib/products/validations";
import { shouldShowFieldErrorMessage } from "@/lib/validations/common";
import type {
  CatalogMeta,
  CatalogStatus,
  ProductAttributeValueType,
  ProductGrade,
  ProductMasterKey,
} from "@/types/product-catalog";

type MasterEntityFormProps = {
  masterKey: ProductMasterKey;
  editId?: string;
};

type FormState = Record<string, unknown>;

function defaultForm(config: ReturnType<typeof getMasterConfig>): FormState {
  return {
    name: "",
    slug: "",
    code: config.hasCode ? "" : undefined,
    summary: config.hasSummary ? "" : undefined,
    image: config.hasImage ? "" : undefined,
    display: config.hasDimensionFields ? "" : undefined,
    dimension: config.hasDimensionFields ? "" : undefined,
    unit: config.hasDimensionFields ? "mm" : undefined,
    valueType: config.hasAttributeType ? "select" : undefined,
    options: config.hasAttributeType ? "" : undefined,
    status: "active" as CatalogStatus,
  };
}

export function MasterEntityForm({ masterKey, editId }: MasterEntityFormProps) {
  const config = getMasterConfig(masterKey);
  const isEdit = Boolean(editId);
  const t = useTranslations(isEdit ? "admin.products.masters.common.edit" : "admin.products.masters.common.create");
  const tSelection = useTranslations("admin.products.masters.common.selection");
  const toast = useToast();
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => defaultForm(config));
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(!isEdit);
  const [gradeOptions, setGradeOptions] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    if (masterKey !== "materials") {
      return;
    }

    productCatalogData.listMasterRecords<ProductGrade>("grades").then((grades) => {
      setGradeOptions(grades.map((grade) => ({ id: grade.id, name: grade.name })));
    });
  }, [masterKey]);

  useEffect(() => {
    if (!editId) {
      return;
    }

    productCatalogData
      .getMasterRecord<FormState & CatalogMeta>(masterKey, editId)
      .then((record) => {
        if (!record) {
          toast.error(t("notFound.title"), t("notFound.body"));
          router.push(config.route);
          return;
        }

        setForm({
          ...record,
          options: Array.isArray(record.options) ? (record.options as string[]).join("\n") : "",
          allowedGradeIds: Array.isArray(record.allowedGradeIds) ? record.allowedGradeIds : [],
        });
        setLoaded(true);
      })
      .catch(() => {
        toast.error(t("errors.title"), t("errors.generic"));
        setLoaded(true);
      });
  }, [config.route, editId, masterKey, router, t, toast]);

  const errors = useMemo(() => validateMasterForm(masterKey, form, isEdit), [form, isEdit, masterKey]);
  const valid = isMasterFormValid(errors);

  function updateField(key: string, value: unknown) {
    setForm((current) => ({ ...current, [key]: value }));
    setTouched((current) => ({ ...current, [key]: true }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setTouched({
      name: true,
      slug: true,
      code: true,
      display: true,
      dimension: true,
      unit: true,
      status: true,
      valueType: true,
    });

    if (!valid) {
      toast.error(t("errors.title"), t("errors.validation"));
      return;
    }

    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        name: String(form.name).trim(),
        slug: normalizeSlug(String(form.slug)),
        status: form.status,
      };

      if (config.hasCode) {
        payload.code = String(form.code).trim();
      }
      if (config.hasSummary) {
        payload.summary = String(form.summary ?? "").trim();
      }
      if (config.hasImage) {
        payload.image = String(form.image ?? "");
      }
      if (config.hasDimensionFields) {
        payload.display = String(form.display).trim();
        payload.dimension = String(form.dimension).trim();
        payload.unit = String(form.unit).trim();
      }
      if (config.hasAttributeType) {
        payload.valueType = form.valueType as ProductAttributeValueType;
        payload.options = String(form.options ?? "")
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
      }

      if (masterKey === "materials") {
        payload.allowedGradeIds = Array.isArray(form.allowedGradeIds) ? form.allowedGradeIds : [];
      }

      if (isEdit && editId) {
        await productCatalogData.updateMasterRecord(masterKey, editId, payload);
        toast.success(t("success.title"), t("success.body"));
        router.push(`${config.route}/${encodeURIComponent(editId)}/view`);
      } else {
        const created = await productCatalogData.createMasterRecord(masterKey, payload);
        toast.success(t("success.title"), t("success.body"));
        router.push(`${config.route}/${encodeURIComponent(created.id)}/view`);
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

  return (
    <form className="admin-create-form admin-master-form" onSubmit={(event) => void handleSubmit(event)}>
      <div className="admin-panel admin-master-form__panel">
      <div className="admin-form-grid admin-form-grid--2">
        <AdminFormField
          id="master-name"
          label={t("fields.name")}
          required
          value={String(form.name ?? "")}
          onChange={(event) => updateField("name", event.target.value)}
          placeholder={t("placeholders.name")}
          fieldError={shouldShowFieldErrorMessage(touched.name ? errors.name : undefined) ? errors.name : undefined}
          errorMessage={errors.name ? t("errors.required") : null}
        />
        <AdminFormField
          id="master-slug"
          label={t("fields.slug")}
          required
          value={String(form.slug ?? "")}
          onChange={(event) => updateField("slug", event.target.value)}
          placeholder={t("placeholders.slug")}
          fieldError={shouldShowFieldErrorMessage(touched.slug ? errors.slug : undefined) ? errors.slug : undefined}
          errorMessage={errors.slug ? t("errors.invalidSlug") : null}
        />
        {config.hasCode ? (
          <AdminFormField
            id="master-code"
            label={t("fields.code")}
            required
            value={String(form.code ?? "")}
            onChange={(event) => updateField("code", event.target.value)}
            placeholder={t("placeholders.code")}
            fieldError={shouldShowFieldErrorMessage(touched.code ? errors.code : undefined) ? errors.code : undefined}
            errorMessage={errors.code ? t("errors.required") : null}
          />
        ) : null}
        <AdminFormSelect
          id="master-status"
          label={t("fields.status")}
          required
          value={String(form.status ?? "active")}
          onChange={(value) => updateField("status", value)}
          options={[
            { value: "active", label: t("status.active") },
            { value: "inactive", label: t("status.inactive") },
          ]}
        />
      </div>

      {config.hasSummary ? (
        <AdminFormTextarea
          id="master-summary"
          label={t("fields.summary")}
          value={String(form.summary ?? "")}
          onChange={(event) => updateField("summary", event.target.value)}
          placeholder={t("placeholders.summary")}
        />
      ) : null}

      {config.hasDimensionFields ? (
        <div className="admin-form-grid admin-form-grid--3">
          <AdminFormField
            id="master-display"
            label={t("fields.display")}
            required
            value={String(form.display ?? "")}
            onChange={(event) => updateField("display", event.target.value)}
          />
          <AdminFormField
            id="master-dimension"
            label={t("fields.dimension")}
            required
            value={String(form.dimension ?? "")}
            onChange={(event) => updateField("dimension", event.target.value)}
          />
          <AdminFormField
            id="master-unit"
            label={t("fields.unit")}
            required
            value={String(form.unit ?? "")}
            onChange={(event) => updateField("unit", event.target.value)}
          />
        </div>
      ) : null}

      {config.hasAttributeType ? (
        <>
          <AdminFormSelect
            id="master-value-type"
            label={t("fields.valueType")}
            required
            value={String(form.valueType ?? "select")}
            onChange={(value) => updateField("valueType", value)}
            options={[
              { value: "text", label: t("valueTypes.text") },
              { value: "number", label: t("valueTypes.number") },
              { value: "boolean", label: t("valueTypes.boolean") },
              { value: "select", label: t("valueTypes.select") },
              { value: "multi-select", label: t("valueTypes.multiSelect") },
              { value: "dimension", label: t("valueTypes.dimension") },
            ]}
          />
          <AdminFormTextarea
            id="master-options"
            label={t("fields.options")}
            value={String(form.options ?? "")}
            onChange={(event) => updateField("options", event.target.value)}
            placeholder={t("placeholders.options")}
          />
        </>
      ) : null}

      {config.hasImage ? (
        <AdminFormImageUpload
          id="master-image"
          label={t("fields.image")}
          value={String(form.image ?? "")}
          onChange={(value) => updateField("image", value)}
          constraints={{ accept: "image/*", maxSizeBytes: 2 * 1024 * 1024 }}
        />
      ) : null}

      {masterKey === "materials" ? (
        <AdminFormMultiSelectDropdown
          id="material-allowed-grades"
          label={t("fields.allowedGrades")}
          values={Array.isArray(form.allowedGradeIds) ? (form.allowedGradeIds as string[]) : []}
          placeholder={tSelection("placeholder")}
          emptyMessage={tSelection("empty")}
          selectedLabel={(count) => tSelection("selectedCount", { count })}
          options={gradeOptions.map((grade) => ({ value: grade.id, label: grade.name }))}
          onChange={(values) => updateField("allowedGradeIds", values)}
        />
      ) : null}

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
