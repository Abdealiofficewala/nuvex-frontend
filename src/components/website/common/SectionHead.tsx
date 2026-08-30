import { SectionBrowseLink } from "@/components/website/common/SectionBrowseLink";
import { SectionIntro } from "@/components/website/common/SectionIntro";

type SectionHeadProps = {
  eyebrow?: string;
  title: string;
  body?: string;
  href: string;
  browseLabel: string;
};

export function SectionHead({ eyebrow, title, body, href, browseLabel }: SectionHeadProps) {
  return (
    <div className={"section-head"}>
      <SectionIntro eyebrow={eyebrow} title={title} body={body} />
      <SectionBrowseLink href={href} label={browseLabel} />
    </div>
  );
}
