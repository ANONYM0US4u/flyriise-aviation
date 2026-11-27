import { FaqAccordion } from "@/components/ui/accordion";
import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHeader, SectionMeta } from "@/components/ui/section";
import { faqs } from "@/data/faqs";
import { faqSection } from "@/data/home";
import { site } from "@/data/site";
import { mailHref, telHref, whatsappHref } from "@/lib/contact";

/**
 * SECTION 10 — FAQ (brief §10 section 10).
 * Real pre-admission questions, answered honestly: the placement question in
 * particular is answered without a single guarantee word.
 */
export function FaqSection() {
  return (
    <Section tone="cloud" id="faq" labeledBy="faq-heading" className="py-20 lg:py-28">
      <div className="container-wide">
        <SectionMeta code="SEC 10" label="FAQ" marker="CRUISE · DAYLIGHT" tone="light" />

        <SectionHeader
          level={2}
          id="faq-heading"
          eyebrow={faqSection.eyebrow}
          heading={faqSection.heading}
          tone="light"
          className="mt-10"
          aside={
            <div className="rounded-[var(--radius-md)] border border-hairline-light bg-cirrus p-5">
              <p className="mono-label text-graphite">Still unanswered?</p>
              <p className="mt-3 text-[0.9375rem] leading-[1.7] text-ink">
                Ask admissions directly. You will get an answer from a person, not a form response.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <a href={telHref} className="mono-label text-ink underline underline-offset-4">
                  {site.contact.phone.display}
                </a>
                <a
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mono-label text-ink underline underline-offset-4"
                >
                  WhatsApp the desk
                </a>
                <a href={mailHref} className="mono-label text-ink underline underline-offset-4">
                  {site.contact.email.display}
                </a>
              </div>
            </div>
          }
        />

        <Reveal className="mt-12">
          <FaqAccordion items={faqs.map((faq) => ({ id: faq.id, question: faq.question, answer: faq.answer }))} />
        </Reveal>

        <p className="measure mt-8 text-[0.8125rem] leading-[1.7] text-graphite">
          Programme details, fees and batch dates are confirmed at counselling. If anything on this page
          is out of date, please tell us and we will correct it.
        </p>
      </div>
    </Section>
  );
}