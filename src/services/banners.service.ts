import type { BannerRecord } from "@/types/content-admin";

async function getBannersFromContentStore() {
  if (typeof window !== "undefined") {
    return null;
  }

  try {
    const { listBanners } = await import("@/lib/server/content-store");
    return listBanners({ activeOnly: true });
  } catch {
    return null;
  }
}

export const bannersService = {
  async getActiveBanners(): Promise<BannerRecord[]> {
    const fromStore = await getBannersFromContentStore();
    return fromStore ?? [];
  },

  async getBannerForRoute(pageRoute: string): Promise<BannerRecord | undefined> {
    const banners = await bannersService.getActiveBanners();
    return banners.find((banner) => banner.pageRoute === pageRoute);
  },
};
