import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/reveal";
import { ContactDetails } from "@/components/website/common/ContactDetails";
import { EnquiryForm } from "@/components/website/contact/EnquiryForm";

export async function ContactSection() {
  const t = await getTranslations("home.cta");

  return (
    <section className="section">
      <div className={cn("container", "cta-band")}>
        <Reveal>
          <p className="t-caption">{t("eyebrow")}</p>
          <h2 className="t-h2">{t("title")}</h2>
          <p className="t-body-lg t-muted measure mt-3">{t("body")}</p>
          <ContactDetails className="t-muted mt-5" showPerson showAddress />
        </Reveal>
        <Reveal delay={90}>
          <EnquiryForm />
        </Reveal>
      </div>
    </section>
  );
}
