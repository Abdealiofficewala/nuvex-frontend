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
  themeCreate: "pages.themeCreate.title",
  themeEdit: "pages.themeEdit.title",
  themeView: "pages.themeView.title",
  themePreview: "pages.themePreview.title",
  themeLogos: "pages.themeLogos.title",
  themeLogosCreate: "pages.themeLogosCreate.title",
  themeLogosView: "pages.themeLogosView.title",
  themeLogosEdit: "pages.themeLogosEdit.title",
  themeColors: "pages.themeColors.title",
  themeColorsCreate: "pages.themeColorsCreate.title",
  themeColorsView: "pages.themeColorsView.title",
  themeColorsEdit: "pages.themeColorsEdit.title",
  topBar: "pages.topBar.title",
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
  bannersCreate: "pages.bannersCreate.title",
  bannersView: "pages.bannersView.title",
  bannersEdit: "pages.bannersEdit.title",
  industriesListing: "pages.industriesListing.title",
  industriesListingCreate: "pages.industriesListingCreate.title",
  industriesListingView: "pages.industriesListingView.title",
  industriesListingEdit: "pages.industriesListingEdit.title",
  industriesListingSectors: "pages.industriesListingSectors.title",
  sectors: "pages.sectors.title",
  sectorsCreate: "pages.sectorsCreate.title",
  sectorsView: "pages.sectorsView.title",
  sectorsEdit: "pages.sectorsEdit.title",
  productsListing: "pages.productsListing.title",
  productsListingCreate: "pages.productsListingCreate.title",
  productsListingView: "pages.productsListingView.title",
  productsListingEdit: "pages.productsListingEdit.title",
  productCategories: "pages.productCategories.title",
  productCategoriesCreate: "pages.productCategoriesCreate.title",
  productCategoriesView: "pages.productCategoriesView.title",
  productCategoriesEdit: "pages.productCategoriesEdit.title",
  productTypes: "pages.productTypes.title",
  productTypesCreate: "pages.productTypesCreate.title",
  productTypesView: "pages.productTypesView.title",
  productTypesEdit: "pages.productTypesEdit.title",
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
  themeCreate: "pages.themeCreate.lede",
  themeEdit: "pages.themeEdit.lede",
  themeView: "pages.themeView.lede",
  themePreview: "pages.themePreview.lede",
  themeLogos: "pages.themeLogos.lede",
  themeLogosCreate: "pages.themeLogosCreate.lede",
  themeLogosView: "pages.themeLogosView.lede",
  themeLogosEdit: "pages.themeLogosEdit.lede",
  themeColors: "pages.themeColors.lede",
  themeColorsCreate: "pages.themeColorsCreate.lede",
  themeColorsView: "pages.themeColorsView.lede",
  themeColorsEdit: "pages.themeColorsEdit.lede",
  topBar: "pages.topBar.lede",
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
  bannersCreate: "pages.bannersCreate.lede",
  bannersView: "pages.bannersView.lede",
  bannersEdit: "pages.bannersEdit.lede",
  industriesListing: "pages.industriesListing.lede",
  industriesListingCreate: "pages.industriesListingCreate.lede",
  industriesListingView: "pages.industriesListingView.lede",
  industriesListingEdit: "pages.industriesListingEdit.lede",
  industriesListingSectors: "pages.industriesListingSectors.lede",
  sectors: "pages.sectors.lede",
  sectorsCreate: "pages.sectorsCreate.lede",
  sectorsView: "pages.sectorsView.lede",
  sectorsEdit: "pages.sectorsEdit.lede",
  productsListing: "pages.productsListing.lede",
  productsListingCreate: "pages.productsListingCreate.lede",
  productsListingView: "pages.productsListingView.lede",
  productsListingEdit: "pages.productsListingEdit.lede",
  productCategories: "pages.productCategories.lede",
  productCategoriesCreate: "pages.productCategoriesCreate.lede",
  productCategoriesView: "pages.productCategoriesView.lede",
  productCategoriesEdit: "pages.productCategoriesEdit.lede",
  productTypes: "pages.productTypes.lede",
  productTypesCreate: "pages.productTypesCreate.lede",
  productTypesView: "pages.productTypesView.lede",
  productTypesEdit: "pages.productTypesEdit.lede",
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
