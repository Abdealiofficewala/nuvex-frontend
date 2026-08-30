import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button/button-link";
import type { ButtonVariant } from "@/types/ui";

type StatusAction = {
  href?: string;
  label: string;
  variant?: ButtonVariant;
  onClick?: () => void;
};

type StatusPageProps = {
  code?: string;
  eyebrow: string;
  title: string;
  lede: string;
  actions?: StatusAction[];
  variant?: "not-found" | "error";
  image?: string;
  imageAlt?: string;
};

export function StatusPage({
  code,
  eyebrow,
  title,
  lede,
  actions,
  variant = "not-found",
  image,
  imageAlt = "",
}: StatusPageProps) {
  const split = variant === "not-found" && Boolean(image);

  return (
    <section className={`status-page status-page--${variant}${split ? " status-page--split" : ""}`}>
      <div className={"status-page__inner"}>
        <div className={"status-page__copy"}>
          {code ? <p className={"status-page__code"}>{code}</p> : null}
          <p className={"t-caption"}>{eyebrow}</p>
          <h1 className={"status-page__title"}>{title}</h1>
          <p className={"status-page__lede"}>{lede}</p>
          {actions?.length ? (
            <div className={"status-page__actions"}>
              {actions.map((action) => {
                if (action.href) {
                  return (
                    <ButtonLink key={action.label} href={action.href} variant={action.variant ?? "primary"}>
                      {action.label}
                    </ButtonLink>
                  );
                }

                return (
                  <Button key={action.label} type="button" variant={action.variant ?? "primary"} onClick={action.onClick}>
                    {action.label}
                  </Button>
                );
              })}
            </div>
          ) : null}
        </div>
        {split && image ? (
          <div className={"status-page__media"}>
            <Image src={image} alt={imageAlt} fill sizes="(max-width: 980px) 100vw, 45vw" priority />
          </div>
        ) : null}
      </div>
    </section>
  );
}
