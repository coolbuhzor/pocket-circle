import { Quote } from "lucide-react";
import { Reveal } from "@/components/marketing/reveal";

export function LandingNote() {
  return (
    <section className="border-t border-primary-light/30 bg-surface/70 py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal>
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/15 text-accent">
            <Quote className="h-5 w-5" />
          </span>
          <h2 className="mt-6 font-display text-2xl font-semibold text-text sm:text-3xl">
            Why we built this
          </h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-text-muted">
            <p>
              One of us grew up around a circle that ran for years on a
              WhatsApp group and a notebook. It worked — until the month the
              person holding the notebook travelled, and two people were
              certain they had already paid.
            </p>
            <p>
              Fintech’s answer is usually “put your money in our wallet.” That
              was never the problem. Nigerians have been running Ajo long before
              anybody had an app, and the trust is already there. What is
              missing is a shared, boring, dependable record — one everybody can
              open at 11pm and agree on.
            </p>
            <p>
              So Pocket Circle stays deliberately small. It holds the agreement,
              not the money. If it ever tries to become a bank, we have lost the
              plot.
            </p>
          </div>
          <div className="mt-8 flex items-center gap-3">
            <span className="h-px w-10 bg-primary-light" aria-hidden />
            <p className="text-sm font-medium text-text">
              The Pocket Circle team
              <span className="text-text-muted"> · Lagos</span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
