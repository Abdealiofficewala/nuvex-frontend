import type { AdminMenuHeaderKey } from "@/lib/admin-menu";
import { AdminPageIntro } from "@/components/admin/common/AdminPageIntro";
import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";

type AdminPageProps = {
  pageKey: AdminMenuHeaderKey;
  wide?: boolean;
  title?: string;
  description?: string;
  hideDescription?: boolean;
  children: React.ReactNode;
};

const PAGE_TITLE_KEYS = {
  dashboard: "pages.dashboard.title",
  themeListing: "pages.themeListing.title",
  themeLogos: "pages.themeLogos.title",
  themeColors: "pages.themeColors.title",
  themeTypography: "pages.themeTypography.title",
  contactDetails: "pages.contactDetails.title",
  socialMediaLinks: "pages.socialMediaLinks.title",
  companyProfile: "pages.companyProfile.title",
  teamRoles: "pages.teamRoles.title",
  teamRolesCreate: "pages.teamRolesCreate.title",
  teamRolesView: "pages.teamRolesView.title",
  teamRolesEdit: "pages.teamRolesEdit.title",
  teamsListing: "pages.teamsListing.title",
  teamsListingCreate: "pages.teamsListingCreate.title",
  teamsListingView: "pages.teamsListingView.title",
  teamsListingEdit: "pages.teamsListingEdit.title",
  banners: "pages.banners.title",
  sectors: "pages.sectors.title",
  productsListing: "pages.productsListing.title",
  productCategories: "pages.productCategories.title",
  productTypes: "pages.productTypes.title",
  productSizes: "pages.productSizes.title",
  users: "pages.users.title",
  usersListingView: "pages.usersListingView.title",
  usersDetails: "pages.usersDetails.title",
  usersAccess: "pages.usersAccess.title",
  usersAccessCreate: "pages.usersAccessCreate.title",
  usersAccessView: "pages.usersAccessView.title",
  usersAccessEdit: "pages.usersAccessEdit.title",
} as const satisfies Record<AdminMenuHeaderKey, `pages.${AdminMenuHeaderKey}.title`>;

const PAGE_LEDE_KEYS = {
  dashboard: "pages.dashboard.lede",
  themeListing: "pages.themeListing.lede",
  themeLogos: "pages.themeLogos.lede",
  themeColors: "pages.themeColors.lede",
  themeTypography: "pages.themeTypography.lede",
  contactDetails: "pages.contactDetails.lede",
  socialMediaLinks: "pages.socialMediaLinks.lede",
  companyProfile: "pages.companyProfile.lede",
  teamRoles: "pages.teamRoles.lede",
  teamRolesCreate: "pages.teamRolesCreate.lede",
  teamRolesView: "pages.teamRolesView.lede",
  teamRolesEdit: "pages.teamRolesEdit.lede",
  teamsListing: "pages.teamsListing.lede",
  teamsListingCreate: "pages.teamsListingCreate.lede",
  teamsListingView: "pages.teamsListingView.lede",
  teamsListingEdit: "pages.teamsListingEdit.lede",
  banners: "pages.banners.lede",
  sectors: "pages.sectors.lede",
  productsListing: "pages.productsListing.lede",
  productCategories: "pages.productCategories.lede",
  productTypes: "pages.productTypes.lede",
  productSizes: "pages.productSizes.lede",
  users: "pages.users.lede",
  usersListingView: "pages.usersListingView.lede",
  usersDetails: "pages.usersDetails.lede",
  usersAccess: "pages.usersAccess.lede",
  usersAccessCreate: "pages.usersAccessCreate.lede",
  usersAccessView: "pages.usersAccessView.lede",
  usersAccessEdit: "pages.usersAccessEdit.lede",
} as const satisfies Record<AdminMenuHeaderKey, `pages.${AdminMenuHeaderKey}.lede`>;

export async function AdminPage({
  pageKey,
  wide = false,
  title,
  description,
  hideDescription = false,
  children,
}: AdminPageProps) {
  const t = await getTranslations("admin.header");
  const pageTitle = title ?? t(PAGE_TITLE_KEYS[pageKey]);
  const pageDescription = hideDescription ? undefined : description ?? t(PAGE_LEDE_KEYS[pageKey]);

  return (
    <div className={cn("admin-page", wide && "admin-page--wide")}>
      {pageDescription ? (
        <AdminPageIntro pageKey={pageKey} title={pageTitle} description={pageDescription} />
      ) : null}
      {children}
    </div>
  );
}
