"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { AdminConfirmModal } from "@/components/admin/common/AdminConfirmModal";
import { AdminListingTable } from "@/components/admin/common/AdminListingTable";
import { AdminStatusBadge } from "@/components/admin/common/AdminStatusBadge";
import type { AdminTableColumn } from "@/components/admin/common/AdminTable";
import { AdminTableActions } from "@/components/admin/common/AdminTableActions";
import { AdminTooltip } from "@/components/admin/common/AdminTooltip";
import { useToast } from "@/components/ui/toast";
import { useAdminResourceListing } from "@/lib/admin/use-admin-resource-listing";
import { productCatalogData } from "@/lib/products/catalog-data";
import { getMasterConfig, masterEditHref, masterViewHref } from "@/lib/products/master-registry";
import type { CatalogMeta, ProductMasterKey } from "@/types/product-catalog";
import { AdminFormField } from "@/components/admin/common/AdminFormField";

type MasterRow = CatalogMeta & {
  name: string;
  slug: string;
  code?: string;
  status?: string;
  sortOrder?: number;
  display?: string;
  valueType?: string;
};

type MasterEntityListingProps = {
  masterKey: ProductMasterKey;
};

export function MasterEntityListing({ masterKey }: MasterEntityListingProps) {
  const config = getMasterConfig(masterKey);
  const t = useTranslations("admin.products.masters.common");
  const tNav = useTranslations("admin.nav");
  const toolbarTitle = tNav(config.navLabelKey as Parameters<typeof tNav>[0]);
  const toast = useToast();
  const [deleteTarget, setDeleteTarget] = useState<MasterRow | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search, setSearch] = useState("");

  const onLoadError = useCallback(() => {
    toast.error(t("errors.title"), t("errors.load"));
  }, [t, toast]);

  const { items, listLoading, refresh } = useAdminResourceListing({
    load: () => productCatalogData.listMasterRecords<MasterRow>(masterKey),
    onLoadError,
  });

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return items;
    }

    return items.filter((row) => {
      const haystack = [row.name, row.slug, row.code, row.display].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(query);
    });
  }, [items, search]);


  async function handleDeleteConfirm() {
    if (!deleteTarget) {
      return;
    }

    setDeleteLoading(true);
    try {
      await productCatalogData.deleteMasterRecord(masterKey, deleteTarget.id);
      toast.success(t("delete.success.title"), t("delete.success.body"));
      setDeleteTarget(null);
      await refresh();
    } catch (error) {
      toast.error(t("errors.title"), error instanceof Error ? error.message : t("errors.generic"));
    } finally {
      setDeleteLoading(false);
    }
  }

  const columns = useMemo<AdminTableColumn<MasterRow>[]>(() => {
    const base: AdminTableColumn<MasterRow>[] = [
      {
        key: "name",
        header: t("table.name"),
        variant: "member",
        render: (row) => (
          <AdminTooltip label={row.name} className="admin-tooltip-trigger--fit">
            <strong className="admin-table__label admin-table__cell-text">{row.name}</strong>
          </AdminTooltip>
        ),
      },
    ];

    if (config.hasCode) {
      base.push({
        key: "code",
        header: t("table.code"),
        render: (row) => row.code ?? "—",
      });
    }

    if (config.hasDimensionFields) {
      base.push(
        {
          key: "display",
          header: t("table.display"),
          render: (row) => row.display ?? "—",
        },
        {
          key: "dimension",
          header: t("table.dimension"),
          render: (row) => (row as MasterRow & { dimension?: string }).dimension ?? "—",
        },
      );
    }

    if (config.hasAttributeType) {
      base.push({
        key: "valueType",
        header: t("table.valueType"),
        render: (row) => row.valueType ?? "—",
      });
    }

    if (config.key === "types") {
      base.push({
        key: "configuration",
        header: t("table.configuration"),
        render: (row) => {
          const typeRow = row as MasterRow & {
            configuration?: { specificationFields: string[]; variantAttributes: string[] };
          };
          const specs = typeRow.configuration?.specificationFields.length ?? 0;
          const variants = typeRow.configuration?.variantAttributes.length ?? 0;
          return `${specs} / ${variants}`;
        },
      });
    }

    base.push(
      {
        key: "status",
        header: t("table.status"),
        variant: "status",
        render: (row) => (
          <AdminStatusBadge
            active={row.status === "active"}
            activeLabel={t("status.active")}
            inactiveLabel={t("status.inactive")}
          />
        ),
      },
      {
        key: "sortOrder",
        header: t("table.sortOrder"),
        render: (row) => row.sortOrder ?? 0,
      },
      {
        key: "updatedAt",
        header: t("table.updated"),
        render: (row) => new Date(row.updatedAt).toLocaleDateString(),
      },
      {
        key: "actions",
        header: t("table.actions"),
        variant: "actions",
        render: (row) => (
          <AdminTableActions
            viewHref={masterViewHref(masterKey, row.id)}
            editHref={masterEditHref(masterKey, row.id)}
            onDelete={() => setDeleteTarget(row)}
            viewLabel={t("actions.view")}
            editLabel={t("actions.edit")}
            deleteLabel={t("actions.delete")}
          />
        ),
      },
    );

    return base;
  }, [config, masterKey, t]);

  return (
    <section className="admin-master-listing">
      <div className="admin-form-grid admin-form-grid--2 admin-master-listing__search">
        <AdminFormField
          id={`${masterKey}-search`}
          label={t("searchLabel")}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t("searchPlaceholder")}
        />
      </div>

      <AdminListingTable
        columns={columns}
        rows={filtered}
        rowKey={(row) => row.id}
        caption={t("table.caption")}
        loading={listLoading}
        toolbarTitle={toolbarTitle}
        createHref={config.createRoute}
        createLabel={t("createAction")}
      />

      <AdminConfirmModal
        open={Boolean(deleteTarget)}
        tone="caution"
        icon="hide"
        title={t("delete.confirm.title")}
        description={t("delete.confirm.description", { name: deleteTarget?.name ?? "" })}
        confirmLabel={t("delete.confirm.confirm")}
        loading={deleteLoading}
        onConfirm={() => void handleDeleteConfirm()}
        onCancel={() => {
          if (!deleteLoading) {
            setDeleteTarget(null);
          }
        }}
      />
    </section>
  );
}
