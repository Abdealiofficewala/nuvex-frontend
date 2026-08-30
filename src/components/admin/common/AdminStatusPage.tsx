import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button/button-link";
import type { ButtonVariant } from "@/types/ui";

type AdminStatusAction = {
  href?: string;
  label: string;
  variant?: ButtonVariant;
  onClick?: () => void;
};

type AdminStatusPageProps = {
  code?: string;
  eyebrow: string;
  title: string;
  lede: string;
  actions?: AdminStatusAction[];
  variant?: "not-found" | "error";
};

export function AdminStatusPage({
  code,
  eyebrow,
  title,
  lede,
  actions,
  variant = "not-found",
}: AdminStatusPageProps) {
  return (
    <section className={`admin-status admin-status--${variant}`}>
      <div className="admin-status__inner">
        {code ? <p className="admin-status__code">{code}</p> : null}
        <p className="admin-status__eyebrow">{eyebrow}</p>
        <h1 className="admin-status__title">{title}</h1>
        <p className="admin-status__lede">{lede}</p>
        {actions?.length ? (
          <div className="admin-status__actions">
            {actions.map((action) => {
              if (action.href) {
                return (
                  <ButtonLink key={action.label} href={action.href} variant={action.variant ?? "primary"}>
                    {action.label}
                  </ButtonLink>
                );
              }

              return (
                <Button
                  key={action.label}
                  type="button"
                  variant={action.variant ?? "primary"}
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
