import type { AdminMenuHeaderKey } from "@/lib/admin-menu";

type AdminPageIntroProps = {
  pageKey: AdminMenuHeaderKey;
  title?: string;
  description?: string;
};

export function AdminPageIntro({ title, description }: AdminPageIntroProps) {
  if (!description) {
    return null;
  }

  return (
    <header className="admin-page-intro">
      {title ? <h2 className="sr-only">{title}</h2> : null}
      <p className="admin-page-intro__desc">{description}</p>
    </header>
  );
}
