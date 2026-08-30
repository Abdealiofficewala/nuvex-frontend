"use client";

import { useEffect, useRef, useState, type ElementType, type HTMLAttributes } from "react";

type RevealProps = {
  as?: ElementType;
  children: React.ReactNode;
  className?: string;
  delay?: number;
} & Omit<HTMLAttributes<HTMLElement>, "children">;

export function Reveal({
  as: Tag = "div",
  children,
  className,
  delay = 0,
  style,
  ...props
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={["reveal", visible ? "is-in" : "", className].filter(Boolean).join(" ")}
      style={delay ? { ...style, transitionDelay: `${delay}ms` } : style}
      {...props}
    >
      {children}
    </Tag>
  );
}
