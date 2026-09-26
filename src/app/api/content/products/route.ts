import { listProducts } from "@/lib/server/content-store";
import { handleApiError, jsonOk } from "@/lib/server/api-response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured") === "true";
    const relatedTo = searchParams.get("relatedTo");

    const products = await listProducts({ featuredOnly: featured, activeOnly: true });

    if (relatedTo) {
      const current = products.find((item) => item.id === relatedTo || item.slug === relatedTo);
      const related = products
        .filter((item) => item.id !== current?.id && item.categorySlug === current?.categorySlug)
        .slice(0, 3);
      return jsonOk(related);
    }

    return jsonOk(products);
  } catch (error) {
    return handleApiError(error);
  }
}
