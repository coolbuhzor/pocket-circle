import {
  LandingCta,
  LandingFooter,
} from "@/components/marketing/LandingCta";
import { LandingHero } from "@/components/marketing/LandingHero";
import { LandingHowItWorks } from "@/components/marketing/LandingHowItWorks";

export default function LandingPage() {
  return (
    <div className="relative flex-1 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary-light/40 blur-3xl" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-secondary/15 blur-3xl" />
      </div>

      <LandingHero />
      <LandingHowItWorks />
      <LandingCta />
      <LandingFooter />
    </div>
  );
}
