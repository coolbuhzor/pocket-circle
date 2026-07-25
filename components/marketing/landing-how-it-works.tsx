import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  CalendarClock,
  Link2,
  Receipt,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/marketing/reveal";

const steps: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Users,
    title: "Agree the terms once",
    body: "Name the circle, set the contribution and how often it runs — weekly, biweekly or monthly. Whoever creates it is the first admin.",
  },
  {
    icon: Link2,
    title: "Send one invite link",
    body: "No adding people by phone number, no spreadsheet. The link lasts 30 days and drops each person at the end of the payout order.",
  },
  {
    icon: Receipt,
    title: "Transfer, then log the receipt",
    body: "The collector’s bank and account number sit at the top of the group. Copy, send from your own bank app, upload the proof with the amount.",
  },
  {
    icon: ShieldCheck,
    title: "The collector confirms or flags",
    body: "One tap to confirm. If something looks off, they flag it with a reason and the payer can re-upload — no arguments in the chat.",
  },
  {
    icon: BellRing,
    title: "Nudge the stragglers",
    body: "A reminder opens WhatsApp with the message already written. It also lands in the person’s notifications inside the app.",
  },
  {
    icon: CalendarClock,
    title: "Close the cycle, hand off",
    body: "Closing moves the turn to the next person in the order, notifies everybody, and keeps the finished cycle in your history.",
  },
];

export function LandingHowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-y border-primary-light/30 bg-surface/70 py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
                One cycle, end to end
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-text sm:text-4xl">
                How a month actually runs
              </h2>
              <p className="mt-4 text-base leading-relaxed text-text-muted">
                Nothing here replaces the trust you already have with your
                people. It just removes the part where everyone has to remember
                the same thing at the same time.
              </p>

              <div className="mt-8 rounded-2xl border border-primary-light/40 bg-bg p-5">
                <p className="font-mono text-xs uppercase tracking-wide text-text-muted">
                  Worth repeating
                </p>
                <p className="mt-2 text-sm leading-relaxed text-text">
                  Pocket Circle never touches the money. There is no wallet, no
                  escrow account and no balance to withdraw — only the record of
                  what your group agreed and what actually happened.
                </p>
              </div>

              <Link
                href="/how-it-works"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-secondary"
              >
                Read the full walkthrough
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>

          <ol className="relative space-y-8 border-l border-dashed border-primary-light/60 pl-8">
            {steps.map((step, i) => (
              <li key={step.title} className="relative">
                <Reveal delay={i * 60}>
                  <span className="absolute -left-[2.85rem] flex h-9 w-9 items-center justify-center rounded-xl border border-primary-light/50 bg-surface text-primary shadow-sm">
                    <step.icon className="h-4 w-4" />
                  </span>
                  <p className="font-mono text-xs font-medium text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-semibold text-text">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                    {step.body}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
