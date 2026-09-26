"use client";

import { useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/buttons";
import {
  AdminReferenceTable,
  type AdminTableColumn,
} from "@/components/admin/common/AdminReferenceTable";
import { useToast } from "@/components/ui/toast";
import { useAdminResourceListing } from "@/lib/admin/use-admin-resource-listing";
import { ROUTES } from "@/lib/constants";
import { STATIC_SIZE_PRESETS, type StaticSizePreset } from "@/data/static/product-size-reference";
import { contentService } from "@/services/content.service";
import type { ProductRecord } from "@/types/content-admin";

type CatalogSizeRow = {
  id: string;
  productName: string;
  label: string;
  slug: string;
  isDefault: boolean;
};

function flattenCatalogSizes(products: ProductRecord[] | undefined): CatalogSizeRow[] {
  return (products ?? []).flatMap((product) =>
    (product.sizeOptions ?? []).map((option) => ({
      id: `${product.id}-${option.slug}`,
      productName: product.name,
      label: option.label,
      slug: option.slug,
      isDefault: option.isDefault === true,
    })),
  );
}

export function ProductSizesPanel() {
  const t = useTranslations("admin.products.sizes");
  const toast = useToast();

  const onLoadError = useCallback(() => {
    toast.error(t("errors.title"), t("errors.load"));
  }, [t, toast]);

  const { items: products, listLoading } = useAdminResourceListing({
    load: contentService.listProducts,
    onLoadError,
  });

  const catalogSizes = useMemo(() => flattenCatalogSizes(products), [products]);

  const presetColumns = useMemo<AdminTableColumn<StaticSizePreset>[]>(
    () => [
      { key: "name", header: t("table.preset"), render: (row) => row.name },
      { key: "category", header: t("table.category"), render: (row) => row.categorySlug },
      {
        key: "labels",
        header: t("table.labels"),
        render: (row) => row.labels.join(", "),
      },
      { key: "note", header: t("table.note"), render: (row) => row.note },
    ],
    [t],
  );

  const catalogColumns = useMemo<AdminTableColumn<CatalogSizeRow>[]>(
    () => [
      { key: "product", header: t("table.product"), render: (row) => row.productName },
      { key: "label", header: t("table.size"), render: (row) => row.label },
      {
        key: "slug",
        header: t("table.slug"),
        render: (row) => <code className="admin-table__code">{row.slug}</code>,
      },
      {
        key: "default",
        header: t("table.primary"),
        render: (row) => (row.isDefault ? t("table.yes") : "—"),
      },
    ],
    [t],
  );

  return (
    <div className="admin-product-reference">
      <section className="admin-product-reference__intro admin-panel">
        <p className="admin-product-reference__lede">{t("intro")}</p>
        <p className="admin-field-hint">{t("hint")}</p>
        <div className="admin-product-reference__actions">
          <ButtonLink href={ROUTES.admin.products.listing} variant="secondary">
            {t("listingAction")}
          </ButtonLink>
          <ButtonLink href={ROUTES.admin.products.create} variant="accent">
            {t("createAction")}
          </ButtonLink>
        </div>
      </section>

      <AdminReferenceTable
        title={t("staticTitle")}
        description={t("staticDescription")}
        columns={presetColumns}
        rows={STATIC_SIZE_PRESETS}
        rowKey={(row) => row.id}
        caption={t("staticCaption")}
      />

      <AdminReferenceTable
        title={t("catalogTitle")}
        description={t("catalogDescription")}
        columns={catalogColumns}
        rows={catalogSizes}
        rowKey={(row) => row.id}
        caption={t("catalogCaption")}
        loading={listLoading}
      />
    </div>
  );
}
