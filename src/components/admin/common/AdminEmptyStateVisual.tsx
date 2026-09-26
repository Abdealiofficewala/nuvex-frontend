export function AdminEmptyStateVisual() {
  return (
    <svg
      className="admin-empty-state__svg"
      viewBox="0 0 320 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="admin-empty-surface" x1="48" y1="36" x2="272" y2="184" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#f3f1ec" />
        </linearGradient>
        <linearGradient id="admin-empty-line" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#1e3a5f" stopOpacity="0.08" />
          <stop offset="1" stopColor="#c17a3a" stopOpacity="0.14" />
        </linearGradient>
      </defs>

      <rect x="36" y="28" width="248" height="164" rx="20" fill="url(#admin-empty-surface)" />
      <rect
        x="36"
        y="28"
        width="248"
        height="164"
        rx="20"
        stroke="#d4cfc4"
        strokeOpacity="0.9"
        strokeWidth="1.5"
      />

      <rect x="68" y="58" width="72" height="8" rx="4" fill="url(#admin-empty-line)" />
      <rect x="68" y="76" width="112" height="6" rx="3" fill="#1e3a5f" fillOpacity="0.07" />
      <rect x="68" y="90" width="96" height="6" rx="3" fill="#1e3a5f" fillOpacity="0.05" />
      <rect x="68" y="104" width="84" height="6" rx="3" fill="#1e3a5f" fillOpacity="0.04" />

      <rect x="196" y="58" width="56" height="56" rx="14" fill="#fff" />
      <rect x="196" y="58" width="56" height="56" rx="14" stroke="#c17a3a" strokeOpacity="0.22" />
      <circle cx="224" cy="78" r="12" fill="#c17a3a" fillOpacity="0.12" />
      <path
        d="M218 78h12M224 72v12"
        stroke="#c17a3a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.72"
      />

      <path
        d="M88 146h144"
        stroke="#d4cfc4"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="5 7"
      />

      <rect x="118" y="160" width="84" height="10" rx="5" fill="#1e3a5f" fillOpacity="0.06" />
      <rect x="134" y="178" width="52" height="6" rx="3" fill="#c17a3a" fillOpacity="0.18" />
    </svg>
  );
}
