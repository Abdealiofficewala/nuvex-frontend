import { ROUTES } from "@/lib/constants";
import type { AdminMenuAccessId, AdminMenuHeaderKey, AdminMenuIcon } from "@/lib/admin-menu";
import type { ProductCatalogStore, ProductMasterKey } from "@/types/product-catalog";

export type MasterEntityConfig = {
  key: ProductMasterKey;
  storeKey: keyof ProductCatalogStore;
  route: string;
  createRoute: string;
  accessId: AdminMenuAccessId;
  headerKey: AdminMenuHeaderKey;
  headerCreateKey: AdminMenuHeaderKey;
  headerViewKey: AdminMenuHeaderKey;
  headerEditKey: AdminMenuHeaderKey;
  icon: AdminMenuIcon;
  navLabelKey: string;
  i18nNamespace: string;
  hasCode: boolean;
  hasSummary: boolean;
  hasImage: boolean;
  hasConfiguration: boolean;
  hasAttributeType: boolean;
  hasDimensionFields: boolean;
};

function masterRoutes(segment: string) {
  const base = `${ROUTES.admin.products.root}/${segment}`;
  return {
    route: base,
    createRoute: `${base}/create`,
    viewHref: (id: string) => `${base}/${encodeURIComponent(id)}/view`,
    editHref: (id: string) => `${base}/${encodeURIComponent(id)}/edit`,
  };
}

const categoriesRoutes = masterRoutes("categories");
const typesRoutes = masterRoutes("types");
const sizesRoutes = masterRoutes("sizes");
const materialsRoutes = masterRoutes("materials");
const gradesRoutes = masterRoutes("grades");
const standardsRoutes = masterRoutes("standards");
const finishesRoutes = masterRoutes("finishes");
const threadsRoutes = masterRoutes("threads");
const headTypesRoutes = masterRoutes("head-types");
const driveTypesRoutes = masterRoutes("drive-types");
const industriesRoutes = masterRoutes("industries");
const applicationsRoutes = masterRoutes("applications");
const packagingRoutes = masterRoutes("packaging");
const attributesRoutes = masterRoutes("attributes");

export const MASTER_ENTITY_CONFIGS: readonly MasterEntityConfig[] = [
  {
    key: "categories",
    storeKey: "categories",
    route: categoriesRoutes.route,
    createRoute: categoriesRoutes.createRoute,
    accessId: "productCategories",
    headerKey: "productCategories",
    headerCreateKey: "productCategoriesCreate",
    headerViewKey: "productCategoriesView",
    headerEditKey: "productCategoriesEdit",
    icon: "productCategories",
    navLabelKey: "productCategories",
    i18nNamespace: "admin.products.masters.common",
    hasCode: true,
    hasSummary: true,
    hasImage: true,
    hasConfiguration: false,
    hasAttributeType: false,
    hasDimensionFields: false,
  },
  {
    key: "types",
    storeKey: "types",
    route: typesRoutes.route,
    createRoute: typesRoutes.createRoute,
    accessId: "productTypes",
    headerKey: "productTypes",
    headerCreateKey: "productTypesCreate",
    headerViewKey: "productTypesView",
    headerEditKey: "productTypesEdit",
    icon: "productTypes",
    navLabelKey: "productTypes",
    i18nNamespace: "admin.products.masters.types",
    hasCode: true,
    hasSummary: true,
    hasImage: true,
    hasConfiguration: true,
    hasAttributeType: false,
    hasDimensionFields: false,
  },
  {
    key: "sizes",
    storeKey: "sizes",
    route: sizesRoutes.route,
    createRoute: sizesRoutes.createRoute,
    accessId: "productSizes",
    headerKey: "productSizes",
    headerCreateKey: "productSizesCreate",
    headerViewKey: "productSizesView",
    headerEditKey: "productSizesEdit",
    icon: "productSizes",
    navLabelKey: "productSizes",
    i18nNamespace: "admin.products.masters.common",
    hasCode: false,
    hasSummary: false,
    hasImage: false,
    hasConfiguration: false,
    hasAttributeType: false,
    hasDimensionFields: true,
  },
  {
    key: "materials",
    storeKey: "materials",
    route: materialsRoutes.route,
    createRoute: materialsRoutes.createRoute,
    accessId: "productMaterials",
    headerKey: "productMaterials",
    headerCreateKey: "productMaterialsCreate",
    headerViewKey: "productMaterialsView",
    headerEditKey: "productMaterialsEdit",
    icon: "productMaterials",
    navLabelKey: "productMaterials",
    i18nNamespace: "admin.products.masters.common",
    hasCode: true,
    hasSummary: false,
    hasImage: false,
    hasConfiguration: false,
    hasAttributeType: false,
    hasDimensionFields: false,
  },
  {
    key: "grades",
    storeKey: "grades",
    route: gradesRoutes.route,
    createRoute: gradesRoutes.createRoute,
    accessId: "productGrades",
    headerKey: "productGrades",
    headerCreateKey: "productGradesCreate",
    headerViewKey: "productGradesView",
    headerEditKey: "productGradesEdit",
    icon: "productGrades",
    navLabelKey: "productGrades",
    i18nNamespace: "admin.products.masters.common",
    hasCode: true,
    hasSummary: false,
    hasImage: false,
    hasConfiguration: false,
    hasAttributeType: false,
    hasDimensionFields: false,
  },
  {
    key: "standards",
    storeKey: "standards",
    route: standardsRoutes.route,
    createRoute: standardsRoutes.createRoute,
    accessId: "productStandards",
    headerKey: "productStandards",
    headerCreateKey: "productStandardsCreate",
    headerViewKey: "productStandardsView",
    headerEditKey: "productStandardsEdit",
    icon: "productStandards",
    navLabelKey: "productStandards",
    i18nNamespace: "admin.products.masters.common",
    hasCode: true,
    hasSummary: false,
    hasImage: false,
    hasConfiguration: false,
    hasAttributeType: false,
    hasDimensionFields: false,
  },
  {
    key: "finishes",
    storeKey: "finishes",
    route: finishesRoutes.route,
    createRoute: finishesRoutes.createRoute,
    accessId: "productFinishes",
    headerKey: "productFinishes",
    headerCreateKey: "productFinishesCreate",
    headerViewKey: "productFinishesView",
    headerEditKey: "productFinishesEdit",
    icon: "productFinishes",
    navLabelKey: "productFinishes",
    i18nNamespace: "admin.products.masters.common",
    hasCode: true,
    hasSummary: false,
    hasImage: false,
    hasConfiguration: false,
    hasAttributeType: false,
    hasDimensionFields: false,
  },
  {
    key: "threads",
    storeKey: "threads",
    route: threadsRoutes.route,
    createRoute: threadsRoutes.createRoute,
    accessId: "productThreads",
    headerKey: "productThreads",
    headerCreateKey: "productThreadsCreate",
    headerViewKey: "productThreadsView",
    headerEditKey: "productThreadsEdit",
    icon: "productThreads",
    navLabelKey: "productThreads",
    i18nNamespace: "admin.products.masters.common",
    hasCode: true,
    hasSummary: false,
    hasImage: false,
    hasConfiguration: false,
    hasAttributeType: false,
    hasDimensionFields: false,
  },
  {
    key: "head-types",
    storeKey: "headTypes",
    route: headTypesRoutes.route,
    createRoute: headTypesRoutes.createRoute,
    accessId: "productHeadTypes",
    headerKey: "productHeadTypes",
    headerCreateKey: "productHeadTypesCreate",
    headerViewKey: "productHeadTypesView",
    headerEditKey: "productHeadTypesEdit",
    icon: "productHeadTypes",
    navLabelKey: "productHeadTypes",
    i18nNamespace: "admin.products.masters.common",
    hasCode: true,
    hasSummary: false,
    hasImage: false,
    hasConfiguration: false,
    hasAttributeType: false,
    hasDimensionFields: false,
  },
  {
    key: "drive-types",
    storeKey: "driveTypes",
    route: driveTypesRoutes.route,
    createRoute: driveTypesRoutes.createRoute,
    accessId: "productDriveTypes",
    headerKey: "productDriveTypes",
    headerCreateKey: "productDriveTypesCreate",
    headerViewKey: "productDriveTypesView",
    headerEditKey: "productDriveTypesEdit",
    icon: "productDriveTypes",
    navLabelKey: "productDriveTypes",
    i18nNamespace: "admin.products.masters.common",
    hasCode: true,
    hasSummary: false,
    hasImage: false,
    hasConfiguration: false,
    hasAttributeType: false,
    hasDimensionFields: false,
  },
  {
    key: "industries",
    storeKey: "industries",
    route: industriesRoutes.route,
    createRoute: industriesRoutes.createRoute,
    accessId: "productIndustries",
    headerKey: "productIndustries",
    headerCreateKey: "productIndustriesCreate",
    headerViewKey: "productIndustriesView",
    headerEditKey: "productIndustriesEdit",
    icon: "productIndustries",
    navLabelKey: "productIndustries",
    i18nNamespace: "admin.products.masters.common",
    hasCode: true,
    hasSummary: true,
    hasImage: false,
    hasConfiguration: false,
    hasAttributeType: false,
    hasDimensionFields: false,
  },
  {
    key: "applications",
    storeKey: "applications",
    route: applicationsRoutes.route,
    createRoute: applicationsRoutes.createRoute,
    accessId: "productApplications",
    headerKey: "productApplications",
    headerCreateKey: "productApplicationsCreate",
    headerViewKey: "productApplicationsView",
    headerEditKey: "productApplicationsEdit",
    icon: "productApplications",
    navLabelKey: "productApplications",
    i18nNamespace: "admin.products.masters.common",
    hasCode: true,
    hasSummary: true,
    hasImage: false,
    hasConfiguration: false,
    hasAttributeType: false,
    hasDimensionFields: false,
  },
  {
    key: "packaging",
    storeKey: "packaging",
    route: packagingRoutes.route,
    createRoute: packagingRoutes.createRoute,
    accessId: "productPackaging",
    headerKey: "productPackaging",
    headerCreateKey: "productPackagingCreate",
    headerViewKey: "productPackagingView",
    headerEditKey: "productPackagingEdit",
    icon: "productPackaging",
    navLabelKey: "productPackaging",
    i18nNamespace: "admin.products.masters.common",
    hasCode: true,
    hasSummary: false,
    hasImage: false,
    hasConfiguration: false,
    hasAttributeType: false,
    hasDimensionFields: false,
  },
  {
    key: "attributes",
    storeKey: "attributes",
    route: attributesRoutes.route,
    createRoute: attributesRoutes.createRoute,
    accessId: "productAttributes",
    headerKey: "productAttributes",
    headerCreateKey: "productAttributesCreate",
    headerViewKey: "productAttributesView",
    headerEditKey: "productAttributesEdit",
    icon: "productAttributes",
    navLabelKey: "productAttributes",
    i18nNamespace: "admin.products.masters.common",
    hasCode: true,
    hasSummary: false,
    hasImage: false,
    hasConfiguration: false,
    hasAttributeType: true,
    hasDimensionFields: false,
  },
];

export function getMasterConfig(key: ProductMasterKey): MasterEntityConfig {
  const config = MASTER_ENTITY_CONFIGS.find((entry) => entry.key === key);
  if (!config) {
    throw new Error(`Unknown master entity: ${key}`);
  }

  return config;
}

export function masterViewHref(key: ProductMasterKey, id: string): string {
  const config = getMasterConfig(key);
  return `${config.route}/${encodeURIComponent(id)}/view`;
}

export function masterEditHref(key: ProductMasterKey, id: string): string {
  const config = getMasterConfig(key);
  return `${config.route}/${encodeURIComponent(id)}/edit`;
}
