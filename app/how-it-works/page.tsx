import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  CircleDot,
  Lock,
  Receipt,
  Shield,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const principles = [
  {
    icon: Banknote,
    title: "We never hold money",
    body: "Transfers happen bank-to-bank, outside the app. Pocket Circle only shows whose turn it is and tracks receipts.",
  },
  {
    icon: Shield,
    title: "Your group stays in control",
    body: "Admins manage members and rotation. Collectors confirm or flag payments. Disputes stay between people — we don't adjudicate.",
  },
  {
    icon: Lock,
    title: "Bank details stay scoped",
    body: "Account numbers are shown only to members of that group, so everyone knows where to send their contribution.",
  },
];

const flow = [
  "Create or join a circle",
  "See whose turn and their bank details",
  "Pay outside the app, upload your receipt",
  "Collector confirms, nudges, or flags",
  "Close the cycle and hand off to the next person",
];

export default function HowItWorksPage() {
  return (
    <div className="flex-1">
      <section className="border-b border-primary-light/30 bg-gradient-to-b from-primary-light/20 to-bg px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-medium text-accent">How Pocket Circle works</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-text sm:text-4xl">
            Clarity for Ajo — without becoming a wallet.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-text-muted sm:text-lg">
            Pocket Circle digitises the coordination layer of rotating savings.
            Friends still send money the way they always have. The app keeps
            everyone aligned on whose turn it is, who has paid, and what happens
            next.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup">
              <Button>
                Get started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/architecture">
              <Button variant="secondary">See architecture</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <h2 className="font-display text-2xl font-semibold text-text">
          What we believe
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {principles.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-primary-light/30 bg-surface p-5 shadow-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                <item.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-primary-light/30 bg-surface/60 py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-semibold text-text">
            The monthly loop
          </h2>
          <ol className="mt-8 space-y-4">
            {flow.map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent font-mono text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <p className="pt-1 text-sm text-text sm:text-base">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <h2 className="font-display text-2xl font-semibold text-text">
          What&apos;s in scope — and what isn&apos;t
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-success/30 bg-success/5 p-5">
            <div className="flex items-center gap-2 text-success">
              <Users className="h-5 w-5" />
              <h3 className="font-semibold">In the app</h3>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-text-muted">
              <li>Group membership and rotation order</li>
              <li>Collector bank details for the current cycle</li>
              <li>Receipt uploads and confirmation / disputes</li>
              <li>Nudges, activity, and cycle handoff</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-primary-light/40 bg-bg p-5">
            <div className="flex items-center gap-2 text-primary">
              <CircleDot className="h-5 w-5" />
              <h3 className="font-semibold">Outside the app</h3>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-text-muted">
              <li>Actual money movement (bank transfer / USSD)</li>
              <li>Escrow, wallets, or interest</li>
              <li>Credit scoring or loan underwriting</li>
              <li>Legal enforcement between members</li>
            </ul>
          </div>
        </div>
        <p className="mt-8 flex items-start gap-2 text-sm text-text-muted">
          <Receipt className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          Receipts are proof for the group — not a payment rail.
        </p>
      </section>
    </div>
  );
}
