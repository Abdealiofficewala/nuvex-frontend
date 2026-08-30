export function AdminComingSoonVisual() {
  return (
    <svg
      className="admin-soon__svg"
      viewBox="0 0 360 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="admin-soon-bg" x1="40" y1="20" x2="320" y2="260" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1e3a5f" stopOpacity="0.12" />
          <stop offset="1" stopColor="#c17a3a" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id="admin-soon-accent" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#c17a3a" />
          <stop offset="1" stopColor="#e8a86a" />
        </linearGradient>
        <linearGradient id="admin-soon-sidebar" x1="72" y1="56" x2="72" y2="224" gradientUnits="userSpaceOnUse">
          <stop stopColor="#101620" />
          <stop offset="1" stopColor="#1a3348" />
        </linearGradient>
      </defs>

      <rect x="24" y="28" width="312" height="224" rx="20" fill="url(#admin-soon-bg)" />
      <rect
        x="24"
        y="28"
        width="312"
        height="224"
        rx="20"
        stroke="#1e3a5f"
        strokeOpacity="0.14"
        strokeWidth="1.5"
      />

      <g className="admin-soon__svg-float">
        <rect x="268" y="12" width="52" height="52" rx="14" fill="#fff" fillOpacity="0.92" />
        <rect x="268" y="12" width="52" height="52" rx="14" stroke="#c17a3a" strokeOpacity="0.35" />
        <path
          d="M284 36h20M294 26v20"
          stroke="url(#admin-soon-accent)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </g>

      <rect x="48" y="52" width="264" height="176" rx="14" fill="#fff" fillOpacity="0.96" />
      <rect x="48" y="52" width="264" height="176" rx="14" stroke="#d4cfc4" strokeOpacity="0.8" />

      <rect x="48" y="52" width="58" height="176" rx="14" fill="url(#admin-soon-sidebar)" />
      <rect x="94" y="52" width="12" height="176" fill="url(#admin-soon-sidebar)" />

      <rect x="62" y="72" width="22" height="22" rx="6" fill="#fff" fillOpacity="0.12" />
      <rect x="62" y="108" width="22" height="8" rx="4" fill="#c17a3a" fillOpacity="0.85" />
      <rect x="62" y="124" width="22" height="8" rx="4" fill="#fff" fillOpacity="0.14" />
      <rect x="62" y="140" width="22" height="8" rx="4" fill="#fff" fillOpacity="0.14" />

      <rect x="118" y="72" width="72" height="10" rx="5" fill="#1e3a5f" fillOpacity="0.12" />
      <rect x="118" y="90" width="120" height="8" rx="4" fill="#c17a3a" fillOpacity="0.35" />

      <rect x="118" y="118" width="168" height="44" rx="10" fill="#f3f1ec" />
      <rect x="118" y="118" width="168" height="44" rx="10" stroke="#d4cfc4" strokeOpacity="0.7" />
      <rect x="132" y="132" width="88" height="8" rx="4" fill="#1e3a5f" fillOpacity="0.1" />
      <rect x="132" y="146" width="120" height="6" rx="3" fill="#1e3a5f" fillOpacity="0.07" />

      <rect x="118" y="174" width="80" height="36" rx="9" fill="#1e3a5f" fillOpacity="0.08" />
      <rect x="206" y="174" width="80" height="36" rx="9" fill="#c17a3a" fillOpacity="0.12" />

      <g className="admin-soon__svg-gear">
        <circle cx="292" cy="198" r="26" fill="#fff" fillOpacity="0.95" />
        <circle cx="292" cy="198" r="26" stroke="url(#admin-soon-accent)" strokeOpacity="0.45" strokeWidth="1.5" />
        <circle cx="292" cy="198" r="10" stroke="#1e3a5f" strokeOpacity="0.55" strokeWidth="1.6" />
        <path
          d="M292 172v8M292 206v8M266 198h8M310 198h8M274.5 180.5l5.6 5.6M303.9 209.9l5.6 5.6M309.5 180.5l-5.6 5.6M280.1 209.9l-5.6 5.6"
          stroke="#c17a3a"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      <rect x="118" y="218" width="140" height="6" rx="3" fill="#d4cfc4" fillOpacity="0.55" />
      <rect className="admin-soon__svg-bar" x="118" y="218" width="56" height="6" rx="3" fill="url(#admin-soon-accent)" />
    </svg>
  );
}
