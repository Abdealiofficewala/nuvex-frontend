export type ProductStatus = "active" | "limited" | "archived";

export type ProductSpecification = {
  label: string;
  value: string;
};

export type ProductSizeOption = {
  label: string;
  slug: string;
  image: string;
  gallery: string[];
  isDefault?: boolean;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  subcategory: string;
  subcategorySlug: string;
  sizeOptions: ProductSizeOption[];
  shortDescription: string;
  description: string;
  image: string;
  gallery: string[];
  features: string[];
  specifications: ProductSpecification[];
  applications: string[];
  materials: string[];
  keySpec: string;
  isFeatured: boolean;
  status: ProductStatus;
};

export type ProductCategory = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  image: string;
  isVisible: boolean;
  isNew: boolean;
  /** Linked catalogue types (from Types admin). */
  typeSlugs: string[];
  /** Denormalized type names aligned with typeSlugs. */
  typeNames: string[];
};

/** Standalone catalogue type (linked from categories). */
export type ProductType = {
  slug: string;
  name: string;
  summary: string;
  image: string;
  isVisible: boolean;
};
