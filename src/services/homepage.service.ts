import { mockHomepage } from "@/data/mock/homepage";
import { axiosClient, withMockFallback } from "@/services/api/axios-client";
import { endpoints } from "@/services/api/endpoints";
import { asRecord, pickString } from "@/services/api/unwrap";
import type { HomepageContent, HomepageStat } from "@/types/homepage";

function normalizeStat(stat: HomepageStat): HomepageStat {
  if (stat.title && stat.description) {
    return stat;
  }
  if (stat.label) {
    return {
      ...stat,
      title: stat.title || stat.label,
      description: stat.description || "",
    };
  }
  return stat;
}

function normalizeHomepage(data?: Partial<HomepageContent> | null): HomepageContent {
  const record = asRecord(data);
  const featuredProductId =
    pickString(record, ["featuredProductId", "featured_product_id", "featuredProductSlug", "featured_product_slug"]) ||
    data?.featuredProductId ||
    data?.featuredProductSlug ||
    mockHomepage.featuredProductId;

  return {
    hero: {
      ...mockHomepage.hero,
      ...data?.hero,
    },
    featuredProductId,
    featuredProductSlug: data?.featuredProductSlug,
    stats: data?.stats?.length ? data.stats.map(normalizeStat) : mockHomepage.stats,
    benefits: data?.benefits?.length ? data.benefits : mockHomepage.benefits,
    infrastructure: {
      ...mockHomepage.infrastructure,
      ...data?.infrastructure,
    },
  };
}

export const homepageService = {
  getHomepage() {
    return withMockFallback(async () => {
      const { data } = await axiosClient.get<Partial<HomepageContent>>(endpoints.homepage);
      return normalizeHomepage(data);
    }, mockHomepage);
  },
};
