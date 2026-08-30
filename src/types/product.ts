export type ProductStatus = "active" | "limited" | "archived";

export type ProductSpecification = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  subcategory: string;
  subcategorySlug: string;
  sizes: string[];
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
};
