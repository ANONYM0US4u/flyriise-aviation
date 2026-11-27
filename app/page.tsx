import { CampusPreview } from "@/components/home/campus-preview";
import { FaqSection } from "@/components/home/faq-section";
import { FinalCta } from "@/components/home/final-cta";
import { HeroStage } from "@/components/home/hero-stage";
import { PositioningSection } from "@/components/home/positioning-section";
import { ProgramsSection } from "@/components/home/programs-section";
import { StoriesSection } from "@/components/home/stories-section";
import { TrainingAscent } from "@/components/home/training-ascent";
import { PartnersManifest } from "@/components/placement/partners-manifest";
import { PlacementSection } from "@/components/placement/placement-section";
import { hero } from "@/data/home";
import { site } from "@/data/site";
import { faqJsonLd, jsonLdScript } from "@/lib/seo";
import { faqs } from "@/data/faqs";

/**
 * HOMEPAGE — the full "Ascent" narrative (brief §04A):
 * apron/dusk → climb/blue hour → first light → daylight → night arrival.
 */
export default function HomePage() {
  return (
    <>
      <HeroStage
        eyebrow={hero.eyebrow}
        headline={hero.headline}
        supporting={hero.supporting}
        primaryCta={hero.primaryCta}
        secondaryCta={hero.secondaryCta}
        scrollHint={hero.scrollHint}
        hudLeft={hero.hudLeft}
        hudRight={hero.hudRight}
        trustStrip={site.trustStrip.map((item) => item.label)}
      />

      <PositioningSection />
      <ProgramsSection />
      <TrainingAscent />
      <PlacementSection />

      <PartnersManifest />
      <StoriesSection />
      <CampusPreview />
      <FaqSection />
      <FinalCta />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(faqJsonLd(faqs))}
      />
    </>
  );
}