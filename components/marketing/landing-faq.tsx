"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Do you hold our money?",
    a: "No — and we have no plans to. There is no wallet to fund and no balance to withdraw. You send the contribution from your own bank app to the collector’s account, exactly the way your group does it today. Pocket Circle only records that it happened.",
  },
  {
    q: "What happens when somebody doesn’t pay?",
    a: "It stops being invisible. Their status turns overdue, the collector can fire off a reminder that opens in WhatsApp, and the cycle history keeps the receipt trail. Actually enforcing it is still between you and your people — we can’t debit anyone or decide who is right in a dispute.",
  },
  {
    q: "Does everyone need to download an app?",
    a: "Everyone in the circle needs an account to see the group and upload receipts, but it runs in the browser — there is nothing to install from a store, and it works on the phone people already carry.",
  },
  {
    q: "Can we change the amount or the rotation order later?",
    a: "Yes. Admins can edit the contribution amount, switch between weekly, biweekly and monthly, and move members up or down the payout order when someone needs to swap turns.",
  },
  {
    q: "Who can see my bank details?",
    a: "Only the members of the group you shared them with, and only so they know where to send the money when it is your turn to collect. They are not public and they are not shared across groups.",
  },
  {
    q: "What does it cost?",
    a: "Nothing at the moment. We are in beta and would rather get the coordination right than rush a price tag. If that ever changes, the groups already using it will hear it from us first.",
  },
  {
    q: "Is this a loan or investment app?",
    a: "No. No credit checks, no interest, no lending, no returns. It is the same rotating savings your family and colleagues already run — just written down where everybody can see it.",
  },
];

export function LandingFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-20 border-t border-primary-light/30 py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
            Straight answers
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-text sm:text-4xl">
            The questions every group asks first
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-muted">
            Money between friends is delicate. Here is exactly what the app does
            and, more importantly, what it deliberately stays out of.
          </p>
        </div>

        <div className="divide-y divide-primary-light/30 border-y border-primary-light/30">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={faq.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span
                    className={cn(
                      "font-display text-base font-semibold transition-colors sm:text-lg",
                      isOpen ? "text-primary" : "text-text",
                    )}
                  >
                    {faq.q}
                  </span>
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors",
                      isOpen
                        ? "border-primary bg-primary text-white"
                        : "border-primary-light/50 text-primary",
                    )}
                  >
                    {isOpen ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </span>
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-out",
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-5 pr-12 text-sm leading-relaxed text-text-muted">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
