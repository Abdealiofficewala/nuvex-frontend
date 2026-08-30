type AdminTableActionIconProps = {
  className?: string;
};

const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  "aria-hidden": true as const,
};

const strokeProps = {
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function AdminTableViewIcon({ className }: AdminTableActionIconProps) {
  return (
    <svg className={className} {...svgProps}>
      <path
        d="M2.25 12s3.75-7.25 9.75-7.25S21.75 12 21.75 12s-3.75 7.25-9.75 7.25S2.25 12 2.25 12Z"
        {...strokeProps}
      />
      <circle cx="12" cy="12" r="3" {...strokeProps} />
    </svg>
  );
}

export function AdminTableEditIcon({ className }: AdminTableActionIconProps) {
  return (
    <svg className={className} {...svgProps}>
      <path d="M12 20h9" {...strokeProps} />
      <path d="M16.5 3.5 20.5 7.5 7 21 3 22l1-4 12.5-14.5Z" {...strokeProps} />
    </svg>
  );
}

export function AdminTableDeleteIcon({ className }: AdminTableActionIconProps) {
  return (
    <svg className={className} {...svgProps}>
      <path d="M4 7h16" {...strokeProps} />
      <path d="M10 7V5.5A1.5 1.5 0 0 1 11.5 4h1A1.5 1.5 0 0 1 14 5.5V7" {...strokeProps} />
      <path d="M6.5 7 7.2 19.2A1.5 1.5 0 0 0 8.7 20.5h6.6a1.5 1.5 0 0 0 1.5-1.3L17.5 7" {...strokeProps} />
      <path d="M10 11v5.5M14 11v5.5" {...strokeProps} />
    </svg>
  );
}
