"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AdminAccordionItem = {
  id: string;
  title: string;
  icon?: ReactNode;
  content: ReactNode;
};

type AdminAccordionProps = {
  items: AdminAccordionItem[];
  defaultOpen?: string[];
  allowMultiple?: boolean;
  className?: string;
};

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={cn("admin-accordion__chevron", open && "is-open")}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M8 10l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AdminAccordion({
  items,
  defaultOpen = [],
  allowMultiple = true,
  className,
}: AdminAccordionProps) {
  const baseId = useId();
  const [openIds, setOpenIds] = useState<string[]>(defaultOpen);

  function toggle(id: string) {
    setOpenIds((current) => {
      const isOpen = current.includes(id);

      if (isOpen) {
        return current.filter((item) => item !== id);
      }

      if (allowMultiple) {
        return [...current, id];
      }

      return [id];
    });
  }

  return (
    <div className={cn("admin-accordion", className)}>
      {items.map((item) => {
        const open = openIds.includes(item.id);
        const panelId = `${baseId}-${item.id}-panel`;
        const triggerId = `${baseId}-${item.id}-trigger`;

        return (
          <section key={item.id} className={cn("admin-accordion__item", open && "is-open")}>
            <button
              id={triggerId}
              type="button"
              className="admin-accordion__trigger"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => toggle(item.id)}
            >
              <span className="admin-accordion__trigger-main">
                {item.icon ? <span className="admin-accordion__icon">{item.icon}</span> : null}
                <span className="admin-accordion__title">{item.title}</span>
              </span>
              <ChevronIcon open={open} />
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className={cn("admin-accordion__panel", open && "is-open")}
              hidden={!open}
            >
              <div className="admin-accordion__panel-inner">{item.content}</div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
