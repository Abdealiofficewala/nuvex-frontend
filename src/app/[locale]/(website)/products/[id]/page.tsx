import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/website/products/ProductDetail";
import { productsService } from "@/services/products.service";

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const products = await productsService.getProducts();
  return (products ?? []).map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await productsService.getProductById(id);

  if (!product) {
    return {};
  }

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.image ? [product.image] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const [product, related] = await Promise.all([
    productsService.getProductById(id),
    productsService.getRelatedProducts(id),
  ]);

  if (!product?.id) {
    notFound();
  }

  return <ProductDetail product={product} related={related} />;
}
