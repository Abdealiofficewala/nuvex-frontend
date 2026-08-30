import { getLocale, getTranslations } from "next-intl/server";
import { formatDate } from "@/lib/utils";
import type { ContactMessage } from "@/types/message";

type DashboardRecentMessagesProps = {
  messages: ContactMessage[];
  totalCount: number;
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export async function DashboardRecentMessages({ messages, totalCount }: DashboardRecentMessagesProps) {
  const t = await getTranslations("admin.dashboard");
  const locale = await getLocale();

  return (
    <section className="dash-panel dash-panel--full">
      <header className="dash-panel__head dash-panel__head--row">
        <div>
          <h2>{t("recentMessages")}</h2>
          <p>{t("recentMessagesBody")}</p>
        </div>
        <span className="dash-panel__count">
          {totalCount} {t("totalLabel")}
        </span>
      </header>

      {messages.length ? (
        <ul className="dash-feed">
          {messages.map((message) => (
            <li key={message.id} className="dash-feed__item">
              <span className="dash-feed__avatar" aria-hidden="true">
                {getInitials(message.name) || "?"}
              </span>
              <div className="dash-feed__content">
                <div className="dash-feed__meta">
                  <strong>{message.name}</strong>
                  <span className={`dash-feed__status dash-feed__status--${message.status}`}>
                    {t(`status.${message.status}`)}
                  </span>
                </div>
                <p className="dash-feed__message">{message.message}</p>
                <div className="dash-feed__footer">
                  <span>{message.email}</span>
                  <time dateTime={message.createdAt}>{formatDate(message.createdAt, locale)}</time>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="dash-panel__empty">
          <span className="dash-panel__empty-icon" aria-hidden="true" />
          <p>{t("emptyMessages")}</p>
        </div>
      )}
    </section>
  );
}
