import { mockIndustries } from "@/data/mock/industries";
import { axiosClient, withMockFallback } from "@/services/api/axios-client";
import { endpoints } from "@/services/api/endpoints";
import type { Sector, SectorWithIndustry } from "@/types/industry";

async function getSectorsFromContentStore() {
  if (typeof window !== "undefined") {
    return null;
  }

  try {
    const { listSectors } = await import("@/lib/server/content-store");
    return listSectors({ activeOnly: true });
  } catch {
    return null;
  }
}

async function getIndustriesFromContentStore() {
  if (typeof window !== "undefined") {
    return null;
  }

  try {
    const { listIndustries } = await import("@/lib/server/content-store");
    return listIndustries({ activeOnly: true });
  } catch {
    return null;
  }
}

async function getSectorFromContentStore(slug: string) {
  if (typeof window !== "undefined") {
    return null;
  }

  try {
    const { getSectorById } = await import("@/lib/server/content-store");
    return getSectorById(slug);
  } catch {
    return null;
  }
}

async function getIndustryFromContentStore(slug: string) {
  if (typeof window !== "undefined") {
    return null;
  }

  try {
    const { getIndustryById } = await import("@/lib/server/content-store");
    return getIndustryById(slug);
  } catch {
    return null;
  }
}

function toLegacySector(item: (typeof mockIndustries)[number] & { applications: string[] }): Sector {
  return {
    id: item.id,
    industryId: "legacy",
    slug: item.slug,
    name: item.name,
    summary: item.summary,
    description: item.description,
    image: item.image,
    applications: item.applications,
    status: "active",
    sortOrder: 0,
  };
}

export const industriesService = {
  async getIndustryGroups() {
    const fromStore = await getIndustriesFromContentStore();
    if (fromStore) {
      return fromStore;
    }

    return [];
  },

  async getSectors() {
    const fromStore = await getSectorsFromContentStore();
    if (fromStore) {
      return fromStore;
    }

    return withMockFallback(async () => {
      const { data } = await axiosClient.get<Sector[]>(endpoints.industries);
      return data;
    }, mockIndustries.map(toLegacySector));
  },

  /** Backward-compatible alias used by existing website pages. */
  async getIndustries() {
    return industriesService.getSectors();
  },

  async getSectorBySlug(slug?: string | null) {
    const key = slug?.trim();
    if (!key) {
      return undefined;
    }

    const fromStore = await getSectorFromContentStore(key);
    if (fromStore) {
      return fromStore;
    }

    const sectors = await industriesService.getSectors();
    return sectors?.find((sector) => sector.slug === key);
  },

  /** Backward-compatible alias used by existing website detail pages. */
  async getIndustryBySlug(slug?: string | null) {
    return industriesService.getSectorBySlug(slug);
  },

  async getIndustryGroupBySlug(slug?: string | null) {
    const key = slug?.trim();
    if (!key) {
      return undefined;
    }

    const fromStore = await getIndustryFromContentStore(key);
    if (fromStore) {
      return fromStore;
    }

    const groups = await industriesService.getIndustryGroups();
    return groups?.find((group) => group.slug === key);
  },

  async getSectorsByIndustrySlug(industrySlug?: string | null) {
    const key = industrySlug?.trim();
    if (!key) {
      return [];
    }

    const group = await industriesService.getIndustryGroupBySlug(key);
    if (!group) {
      return [];
    }

    const sectors = await industriesService.getSectors();
    return (sectors ?? []).filter((sector) => sector.industryId === group.id);
  },

  async getSectorByIndustryAndSlug(industrySlug?: string | null, sectorSlug?: string | null) {
    const sectorKey = sectorSlug?.trim();
    if (!sectorKey) {
      return undefined;
    }

    const sectors = await industriesService.getSectorsByIndustrySlug(industrySlug);
    return sectors.find((sector) => sector.slug === sectorKey);
  },

  async getRelatedSectors(slug?: string | null, limit = 3) {
    const key = slug?.trim();
    const sectors = await industriesService.getSectors();
    const current = sectors?.find((sector) => sector.slug === key);

    if (!current) {
      return (sectors ?? []).filter((sector) => sector.slug !== key).slice(0, limit);
    }

    const sameIndustry = (sectors ?? []).filter(
      (sector) => sector.industryId === current.industryId && sector.slug !== key,
    );
    const remainder = (sectors ?? []).filter(
      (sector) => sector.industryId !== current.industryId && sector.slug !== key,
    );

    return [...sameIndustry, ...remainder].slice(0, limit);
  },

  /** Backward-compatible alias. */
  async getRelatedIndustries(slug?: string | null, limit = 3) {
    return industriesService.getRelatedSectors(slug, limit);
  },

  async enrichSectorsWithIndustry(sectors: Sector[]): Promise<SectorWithIndustry[]> {
    const groups = await industriesService.getIndustryGroups();
    const groupMap = new Map(groups.map((group) => [group.id, group]));

    return sectors.map((sector) => {
      const group = groupMap.get(sector.industryId);
      return {
        ...sector,
        industryName: group?.name ?? "",
        industrySlug: group?.slug ?? "",
      };
    });
  },
};
