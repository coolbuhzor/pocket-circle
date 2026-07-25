import { LandingHero } from "@/components/marketing/landing-hero";
import { LandingMarquee } from "@/components/marketing/landing-marquee";
import { LandingProblem } from "@/components/marketing/landing-problem";
import { LandingHowItWorks } from "@/components/marketing/landing-how-it-works";
import { LandingFeatures } from "@/components/marketing/landing-features";
import { LandingNote } from "@/components/marketing/landing-note";
import { LandingFaq } from "@/components/marketing/landing-faq";
import { LandingCta } from "@/components/marketing/landing-cta";
import { LandingFooter } from "@/components/marketing/landing-footer";

export default function LandingPage() {
  return (
    <div className="flex-1">
      <LandingHero />
      <LandingMarquee />
      <LandingProblem />
      <LandingHowItWorks />
      <LandingFeatures />
      <LandingNote />
      <LandingFaq />
      <LandingCta />
      <LandingFooter />
    </div>
  );
}
