"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  AdminResourceViewActions,
  AdminResourceViewEmpty,
  AdminResourceViewField,
  AdminResourceViewGrid,
  AdminResourceViewHero,
  AdminResourceViewShell,
} from "@/components/admin/common/AdminResourceViewDetail";
import { productCatalogData } from "@/lib/products/catalog-data";
import { getMasterConfig, masterEditHref } from "@/lib/products/master-registry";
import { formatDate } from "@/lib/utils";
import type { CatalogMeta, ProductMasterKey } from "@/types/product-catalog";

type MasterEntityViewProps = {
  masterKey: ProductMasterKey;
  id: string;
};

type MasterRecord = CatalogMeta & Record<string, unknown>;

export function MasterEntityView({ masterKey, id }: MasterEntityViewProps) {
  const config = getMasterConfig(masterKey);
  const t = useTranslations("admin.products.masters.common.view");
  const locale = useLocale();
  const [record, setRecord] = useState<MasterRecord | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    productCatalogData
      .getMasterRecord<MasterRecord>(masterKey, id)
      .then((item) => setRecord(item ?? null))
      .finally(() => setLoaded(true));
  }, [id, masterKey]);

  if (loaded && !record) {
    return (
      <AdminResourceViewEmpty
        title={t("notFound.title")}
        body={t("notFound.body")}
        backHref={config.route}
        backLabel={t("cancelAction")}
      />
    );
  }

  if (!record) {
    return null;
  }

  return (
    <AdminResourceViewShell>
      <AdminResourceViewHero
        imageSrc={config.hasImage ? String(record.image ?? "") : undefined}
        emptyImageLabel={t("noImage")}
        title={String(record.name)}
        subtitle={config.hasSummary ? String(record.summary ?? "") : undefined}
      />

      <AdminResourceViewGrid>
        <AdminResourceViewField label={t("fields.slug")}>
          <code className="admin-table__code">{String(record.slug)}</code>
        </AdminResourceViewField>
        {config.hasCode ? (
          <AdminResourceViewField label={t("fields.code")}>{String(record.code ?? "")}</AdminResourceViewField>
        ) : null}
        {config.hasDimensionFields ? (
          <>
            <AdminResourceViewField label={t("fields.display")}>{String(record.display ?? "")}</AdminResourceViewField>
            <AdminResourceViewField label={t("fields.dimension")}>{String(record.dimension ?? "")}</AdminResourceViewField>
            <AdminResourceViewField label={t("fields.unit")}>{String(record.unit ?? "")}</AdminResourceViewField>
          </>
        ) : null}
        {config.hasAttributeType ? (
          <>
            <AdminResourceViewField label={t("fields.valueType")}>{String(record.valueType ?? "")}</AdminResourceViewField>
            <AdminResourceViewField label={t("fields.options")}>
              {Array.isArray(record.options) ? (record.options as string[]).join(", ") : ""}
            </AdminResourceViewField>
          </>
        ) : null}
        <AdminResourceViewField label={t("fields.status")}>{String(record.status ?? "")}</AdminResourceViewField>
        <AdminResourceViewField label={t("fields.created")}>
          <time dateTime={record.createdAt}>{formatDate(record.createdAt, locale)}</time>
        </AdminResourceViewField>
        <AdminResourceViewField label={t("fields.updated")}>
          <time dateTime={record.updatedAt}>{formatDate(record.updatedAt, locale)}</time>
        </AdminResourceViewField>
      </AdminResourceViewGrid>

      <AdminResourceViewActions
        cancelHref={config.route}
        cancelLabel={t("cancelAction")}
        editHref={masterEditHref(masterKey, id)}
        editLabel={t("editAction")}
      />
    </AdminResourceViewShell>
  );
}
