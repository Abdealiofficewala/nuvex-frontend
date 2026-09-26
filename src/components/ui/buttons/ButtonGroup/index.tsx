import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonGroupProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function ButtonGroup({ children, className, ...props }: ButtonGroupProps) {
  return (
    <div className={cn("ui-button-group", className)} role="group" {...props}>
      {children}
    </div>
  );
}
