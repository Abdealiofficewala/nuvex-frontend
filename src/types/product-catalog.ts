export type CatalogStatus = "active" | "inactive";

export type CatalogMeta = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type CatalogRef = {
  id: string;
  name: string;
  slug: string;
};

export type ProductCategory = CatalogMeta & {
  name: string;
  slug: string;
  code: string;
  summary: string;
  image: string;
  status: CatalogStatus;
};

export type ProductCategoryInput = Omit<ProductCategory, keyof CatalogMeta>;

export type SpecificationFieldKey =
  | "headType"
  | "driveType"
  | "diameter"
  | "length"
  | "threadPitch"
  | "innerDiameter"
  | "outerDiameter"
  | "thickness"
  | "height"
  | "widthAcrossFlats"
  | "thread";

export type VariantAttributeKey =
  | "size"
  | "material"
  | "grade"
  | "standard"
  | "finish"
  | "thread"
  | "packaging";

export type ProductTypeConfiguration = {
  specificationFields: SpecificationFieldKey[];
  variantAttributes: VariantAttributeKey[];
  allowedSizeIds: string[];
  allowedMaterialIds: string[];
  allowedGradeIds: string[];
  allowedStandardIds: string[];
  allowedFinishIds: string[];
  allowedThreadIds: string[];
  allowedHeadTypeIds: string[];
  allowedDriveTypeIds: string[];
};

export type ProductType = CatalogMeta & {
  name: string;
  slug: string;
  code: string;
  summary: string;
  image: string;
  status: CatalogStatus;
  configuration: ProductTypeConfiguration;
};

export type ProductTypeInput = Omit<ProductType, keyof CatalogMeta>;

export type ProductSize = CatalogMeta & {
  name: string;
  slug: string;
  display: string;
  dimension: string;
  unit: string;
  status: CatalogStatus;
};

export type ProductSizeInput = Omit<ProductSize, keyof CatalogMeta>;

export type ProductMaterial = CatalogMeta & {
  name: string;
  slug: string;
  code: string;
  status: CatalogStatus;
  allowedGradeIds: string[];
};

export type ProductMaterialInput = Omit<ProductMaterial, keyof CatalogMeta>;

export type ProductGrade = CatalogMeta & {
  name: string;
  slug: string;
  code: string;
  status: CatalogStatus;
};

export type ProductGradeInput = Omit<ProductGrade, keyof CatalogMeta>;

export type ProductStandard = CatalogMeta & {
  name: string;
  slug: string;
  code: string;
  status: CatalogStatus;
};

export type ProductStandardInput = Omit<ProductStandard, keyof CatalogMeta>;

export type ProductFinish = CatalogMeta & {
  name: string;
  slug: string;
  code: string;
  status: CatalogStatus;
};

export type ProductFinishInput = Omit<ProductFinish, keyof CatalogMeta>;

export type ProductThread = CatalogMeta & {
  name: string;
  slug: string;
  code: string;
  status: CatalogStatus;
};

export type ProductThreadInput = Omit<ProductThread, keyof CatalogMeta>;

export type ProductHeadType = CatalogMeta & {
  name: string;
  slug: string;
  code: string;
  status: CatalogStatus;
};

export type ProductHeadTypeInput = Omit<ProductHeadType, keyof CatalogMeta>;

export type ProductDriveType = CatalogMeta & {
  name: string;
  slug: string;
  code: string;
  status: CatalogStatus;
};

export type ProductDriveTypeInput = Omit<ProductDriveType, keyof CatalogMeta>;

export type ProductIndustry = CatalogMeta & {
  name: string;
  slug: string;
  code: string;
  summary: string;
  status: CatalogStatus;
};

export type ProductIndustryInput = Omit<ProductIndustry, keyof CatalogMeta>;

export type ProductApplication = CatalogMeta & {
  name: string;
  slug: string;
  code: string;
  summary: string;
  status: CatalogStatus;
};

export type ProductApplicationInput = Omit<ProductApplication, keyof CatalogMeta>;

export type ProductPackaging = CatalogMeta & {
  name: string;
  slug: string;
  code: string;
  status: CatalogStatus;
};

export type ProductPackagingInput = Omit<ProductPackaging, keyof CatalogMeta>;

export type ProductAttributeValueType =
  | "text"
  | "number"
  | "boolean"
  | "select"
  | "multi-select"
  | "dimension";

export type ProductAttribute = CatalogMeta & {
  name: string;
  slug: string;
  code: string;
  valueType: ProductAttributeValueType;
  options: string[];
  status: CatalogStatus;
};

export type ProductAttributeInput = Omit<ProductAttribute, keyof CatalogMeta>;

export type ProductDocumentType =
  | "datasheet"
  | "technical-specification"
  | "certificate"
  | "manual"
  | "catalog";

export type ProductMediaAsset = {
  url: string;
  alt: string;
};

export type ProductMedia = {
  thumbnail: ProductMediaAsset | null;
  images: ProductMediaAsset[];
  technicalDrawings: ProductMediaAsset[];
};

export type ProductDocument = {
  id: string;
  type: ProductDocumentType;
  title: string;
  url: string;
};

export type ProductDimensionValue = {
  value: number;
  unit: string;
};

export type ProductSpecificationValues = Partial<
  Record<SpecificationFieldKey, string | ProductDimensionValue>
> & {
  productAttributes: Array<{
    attributeId: string;
    attributeName: string;
    value: string | number | boolean | string[];
  }>;
};

export type ProductVariantAvailability = "in-stock" | "limited" | "out-of-stock";

export type ProductVariant = {
  id: string;
  sku: string;
  partNumber: string;
  sizeId: string;
  sizeName: string;
  materialId: string;
  materialName: string;
  gradeId: string;
  gradeName: string;
  standardId: string;
  standardName: string;
  finishId: string;
  finishName: string;
  threadId: string;
  threadName: string;
  packagingId: string;
  packagingName: string;
  availability: ProductVariantAvailability;
  status: CatalogStatus;
};

export type ProductRelationship = {
  relatedProducts: string[];
  compatibleProducts: string[];
  accessories: string[];
};

export type ProductSEO = {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonical: string;
};

export type CatalogProductStatus = "active" | "draft" | "archived";

export type CatalogProduct = CatalogMeta & {
  productCode: string;
  slug: string;
  name: string;
  category: CatalogRef;
  type: CatalogRef;
  status: CatalogProductStatus;
  isNew: boolean;
  shortDescription: string;
  description: string;
  features: string[];
  specifications: ProductSpecificationValues;
  variants: ProductVariant[];
  industries: CatalogRef[];
  applications: CatalogRef[];
  media: ProductMedia;
  documents: ProductDocument[];
  relationships: ProductRelationship;
  seo: ProductSEO;
};

export type CatalogProductInput = Omit<CatalogProduct, keyof CatalogMeta>;

export type ProductCatalogStore = {
  categories: ProductCategory[];
  types: ProductType[];
  sizes: ProductSize[];
  materials: ProductMaterial[];
  grades: ProductGrade[];
  standards: ProductStandard[];
  finishes: ProductFinish[];
  threads: ProductThread[];
  headTypes: ProductHeadType[];
  driveTypes: ProductDriveType[];
  industries: ProductIndustry[];
  applications: ProductApplication[];
  packaging: ProductPackaging[];
  attributes: ProductAttribute[];
  products: CatalogProduct[];
};

export type ProductMasterKey =
  | "categories"
  | "types"
  | "sizes"
  | "materials"
  | "grades"
  | "standards"
  | "finishes"
  | "threads"
  | "head-types"
  | "drive-types"
  | "industries"
  | "applications"
  | "packaging"
  | "attributes";
