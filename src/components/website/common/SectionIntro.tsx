type SectionIntroContentProps = {
  eyebrow?: string;
  title: string;
  body?: string;
  bodyClassName?: string;
};

export function SectionIntroContent({
  eyebrow,
  title,
  body,
  bodyClassName = "t-body-lg t-muted mt-3",
}: SectionIntroContentProps) {
  return (
    <>
      {eyebrow ? <p className="t-caption">{eyebrow}</p> : null}
      <h2 className="t-h2">{title}</h2>
      {body ? <p className={bodyClassName}>{body}</p> : null}
    </>
  );
}

type SectionIntroProps = SectionIntroContentProps;

export function SectionIntro(props: SectionIntroProps) {
  return (
    <div className="section__intro">
      <SectionIntroContent {...props} />
    </div>
  );
}
