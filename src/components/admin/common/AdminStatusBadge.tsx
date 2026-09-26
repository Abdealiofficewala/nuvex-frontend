import { cn } from "@/lib/utils";

type AdminStatusBadgeProps = {
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
  className?: string;
};

export function AdminStatusBadge({
  active,
  activeLabel,
  inactiveLabel,
  className,
}: AdminStatusBadgeProps) {
  return (
    <span className={cn("admin-table-badge", active ? "is-visible" : "is-hidden", className)}>
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}
