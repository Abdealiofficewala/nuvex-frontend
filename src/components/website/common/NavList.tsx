import { Link } from "@/i18n/routing";

export type NavListItem = {
  href: string;
  label: string;
};

type NavListProps = {
  items: NavListItem[];
  className?: string;
  itemClassName?: (href: string) => string;
  onNavigate?: () => void;
};

export function NavList({ items, className, itemClassName, onNavigate }: NavListProps) {
  return (
    <nav className={className}>
      {items?.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={itemClassName?.(item.href)}
          onClick={onNavigate}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
