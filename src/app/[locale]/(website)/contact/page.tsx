import { getTranslations } from "next-intl/server";
import { ContactInfo } from "@/components/website/contact/ContactInfo";
import { ContactMap } from "@/components/website/contact/ContactMap";
import { EnquiryForm } from "@/components/website/contact/EnquiryForm";

export default async function ContactPage() {
  const t = await getTranslations("contact");

  return (
    <div className={"contact-page"}>
      <div className="container">
        <header className={"contact-head"}>
          <p className="t-caption">{t("eyebrow")}</p>
          <h1 className="t-h2">{t("title")}</h1>
          <p className="t-muted">{t("lede")}</p>
        </header>
        <div className={"contact-layout"}>
          <ContactInfo />
          <div className={"contact-panel"}>
            <p className="t-caption">{t("formEyebrow")}</p>
            <h2 className="t-h2">{t("formTitle")}</h2>
            <p className="t-muted mt-3">{t("formLede")}</p>
            <div className={"contact-panel__form"}>
              <EnquiryForm />
            </div>
          </div>
        </div>
      </div>
      <ContactMap />
    </div>
  );
}
