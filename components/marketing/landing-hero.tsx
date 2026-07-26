import Link from "next/link";
import { ArrowRight, Building2, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/marketing/reveal";
import { HeroPreview } from "@/components/marketing/hero-preview";

const assurances = [
  { icon: Lock, label: "No wallet, no escrow" },
  { icon: Building2, label: "Works with any Nigerian bank" },
  { icon: Sparkles, label: "Free while we’re in beta" },
];

export function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pc-grid absolute inset-0 -z-20" aria-hidden />
      <div
        className="absolute -left-32 -top-24 -z-10 h-80 w-80 rounded-full bg-primary-light/45 blur-3xl animate-[pc-drift_18s_ease-in-out_infinite]"
        aria-hidden
      />
      <div
        className="absolute -right-24 top-32 -z-10 h-72 w-72 rounded-full bg-accent/25 blur-3xl animate-[pc-drift_22s_ease-in-out_infinite_reverse]"
        aria-hidden
      />

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:pb-28 lg:pt-20">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-light/50 bg-surface/80 px-3 py-1.5 text-xs font-medium text-primary shadow-sm backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent animate-[pc-ring_2.4s_ease-out_infinite]" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Open beta · built with real Ajo groups
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-text sm:text-5xl lg:text-[3.5rem]">
              Run your Ajo without
              <span className="relative ml-2 inline-block text-primary">
                chasing anybody
                <svg
                  viewBox="0 0 240 12"
                  className="absolute -bottom-1 left-0 h-2.5 w-full text-accent"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M2 8.5C48 3.5 130 1.8 238 5.4"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              .
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-text-muted sm:text-lg">
              Six friends, ₦50,000 each, one person collects, then it rotates.
              Pocket Circle keeps that agreement in one place: whose turn it is,
              who has sent their money, and the receipt to prove it. The cash
              still goes straight from your bank to theirs.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup">
                <Button size="lg" className="group w-full sm:w-auto">
                  Start a circle free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  See how a cycle runs
                </Button>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={260}>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {assurances.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-2 text-sm text-text-muted"
                >
                  <item.icon className="h-4 w-4 text-primary" />
                  {item.label}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={320}>
            <p className="mt-6 text-sm text-text-muted">
              Got an invite link from your group?{" "}
              <Link
                href="/login"
                className="font-medium text-primary underline decoration-accent decoration-2 underline-offset-4 hover:text-secondary"
              >
                Log in and open it
              </Link>{" "}
              and you’ll be in the rotation in under a minute.
            </p>
          </Reveal>
        </div>

        <Reveal delay={160} className="lg:mt-4">
          <HeroPreview />
        </Reveal>
      </div>
    </section>
  );
}
