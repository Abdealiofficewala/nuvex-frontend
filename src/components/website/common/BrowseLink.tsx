import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type BrowseLinkProps = {
  label: string;
  href?: string;
  className?: string;
};

export function BrowseLink({ label, href, className }: BrowseLinkProps) {
  const classes = cn("browse-link", className);
  const content = (
    <>
      <span className={"browse-link__text"}>{label}</span>
      <span className={"browse-link__icon"} aria-hidden="true" />
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return <span className={classes}>{content}</span>;
}
