import { MediaFill } from "@/components/ui/media-fill";
import type { Industry } from "@/types/industry";

type IndustryRowProps = {
  industry: Industry;
  titleAs?: "h2" | "h3";
  body?: string;
  showApplications?: boolean;
  children?: React.ReactNode;
};

export function IndustryRow({
  industry,
  titleAs = "h3",
  body,
  showApplications = false,
  children,
}: IndustryRowProps) {
  const Title = titleAs;
  const copy = body ?? industry?.summary;

  return (
    <article className={"industry-row"}>
      <MediaFill src={industry?.image} alt={industry?.name} className={"industry-row__media"} sizes="60vw" />
      <div className={"industry-row__copy"}>
        <Title className="t-h3">{industry?.name}</Title>
        {copy ? <p className="t-muted mt-3">{copy}</p> : null}
        {showApplications && industry?.applications?.length ? (
          <ul className="reason-list mt-4">
            {industry.applications.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
        {children}
      </div>
    </article>
  );
}
