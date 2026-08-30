import { ButtonLink } from "@/components/ui/button/button-link";
import type { HeroAction } from "@/types/ui";

type HeroActionsProps = {
  actions: HeroAction[];
  className?: string;
};

export function HeroActions({ actions, className }: HeroActionsProps) {
  if (!actions.length) {
    return null;
  }

  return (
    <div className={className}>
      {actions.map((action) => (
        <ButtonLink
          key={String(action.href)}
          href={action.href}
          variant={action.variant ?? "accent"}
          arrow={action.arrow}
        >
          {action.label}
        </ButtonLink>
      ))}
    </div>
  );
}
