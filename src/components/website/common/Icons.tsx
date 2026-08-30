type IconProps = {
  name: "phone" | "whatsapp" | "email" | "pin";
};

export function Icon({ name }: IconProps) {
  return (
    <svg
      className={name === "whatsapp" ? "ui-icon ui-icon--whatsapp" : "ui-icon"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {name === "phone" ? (
        <path
          d="M8.5 4.5h2.2c.4 0 .8.2 1 .6l.8 2.1a.9.9 0 0 1-.2 1l-1.4 1.1a8.8 8.8 0 0 0 4.2 4.2l1.1-1.4a.9.9 0 0 1 1-.2l2.1.8c.5.2.7.6.7 1.1v2.1c0 .9-.7 1.6-1.6 1.6-6.2 0-11.1-4.9-11.1-11.1 0-.9.7-1.6 1.6-1.6Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}
      {name === "whatsapp" ? (
        <path
          fill="currentColor"
          d="M12 2C6.49 2 2 6.49 2 12c0 1.97.53 3.91 1.52 5.6L2 22l4.56-1.2A9.93 9.93 0 0 0 12 22c5.51 0 10-4.49 10-10S17.51 2 12 2zm5.91 14.05c-.25.69-1.43 1.28-1.99 1.36-.51.08-1.17.11-1.89-.12-.43-.14-1-.33-1.72-.64-.6-.26-1.02-.46-1.52-.73-2.47-1.32-4.1-3.36-4.21-3.52-.12-.16-.99-1.32-.99-2.53 0-1.2.63-1.79.86-2.04.22-.24.49-.31.65-.31.16 0 .33 0 .47.01.15 0 .35-.06.55.42.2.48.67 1.65.73 1.77.06.12.1.26.02.42-.08.16-.12.26-.24.39-.12.14-.25.31-.36.41-.12.12-.24.25-.1.49.14.24.61 1 1.31 1.63.9.8 1.65 1.05 1.89 1.17.24.12.37.1.51-.06.14-.17.59-.69.75-.93.16-.24.31-.2.53-.12.21.08 1.36.64 1.6.76.23.12.39.18.45.27.06.1.06.57-.19 1.26z"
        />
      ) : null}
      {name === "email" ? (
        <>
          <rect
            x="3.5"
            y="6.2"
            width="17"
            height="11.6"
            rx="1.6"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M4.5 7.8 12 13.2l7.5-5.4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : null}
      {name === "pin" ? (
        <>
          <path
            d="M12 21s5-5.4 5-9.1a5 5 0 1 0-10 0c0 3.7 5 9.1 5 9.1Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="11.8" r="1.6" fill="currentColor" stroke="none" />
        </>
      ) : null}
    </svg>
  );
}
