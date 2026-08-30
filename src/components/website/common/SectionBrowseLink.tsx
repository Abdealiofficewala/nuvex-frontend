import { BrowseLink } from "@/components/website/common/BrowseLink";

type SectionBrowseLinkProps = {
  href: string;
  label: string;
};

export function SectionBrowseLink({ href, label }: SectionBrowseLinkProps) {
  return <BrowseLink href={href} label={label} className="browse-link--section" />;
}
