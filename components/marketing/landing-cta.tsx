import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/marketing/reveal";
import { getInitials } from "@/lib/utils";

const faces = ["Amaka Obi", "Tunde Bello", "Zainab Musa", "Chidi Eze"];

export function LandingCta() {
  return (
    <section className="px-4 pb-20 pt-4 sm:px-6">
      <Reveal>
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-[#2c2560] to-[#171339] px-6 py-14 text-center sm:px-12 sm:py-20">
          <div
            className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-accent/25 blur-3xl animate-[pc-drift_20s_ease-in-out_infinite]"
            aria-hidden
          />
          <div
            className="absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-secondary/30 blur-3xl animate-[pc-drift_26s_ease-in-out_infinite_reverse]"
            aria-hidden
          />

          <div className="relative">
            <div className="flex justify-center -space-x-3">
              {faces.map((name, i) => (
                <span
                  key={name}
                  style={{ animationDelay: `${i * 400}ms` }}
                  className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-primary bg-primary-light text-xs font-semibold text-primary animate-[pc-float_6s_ease-in-out_infinite]"
                >
                  {getInitials(name)}
                </span>
              ))}
              <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-primary bg-accent text-xs font-bold text-white">
                +
              </span>
            </div>

            <h2 className="mx-auto mt-8 max-w-2xl font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Your next cycle could be the last one you argue about
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-primary-light">
              Set up the circle in about two minutes, share the link, and let
              everyone see the same thing for once.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 text-base font-semibold text-primary transition-colors hover:bg-accent hover:text-white"
              >
                Create your circle
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-white/25 px-6 text-base font-medium text-white transition-colors hover:bg-white/10"
              >
                Still reading? Start here
              </Link>
            </div>

            <p className="mt-6 font-mono text-xs text-primary-light">
              Free in beta · no card, no wallet, no minimum
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
