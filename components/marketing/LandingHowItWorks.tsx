import { CircleDot, Receipt, Users, type LucideIcon } from "lucide-react";

const steps: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Users,
    title: "Create or join a group",
    body: "Start a circle with friends, or accept an invite. Set the monthly amount once.",
  },
  {
    icon: CircleDot,
    title: "See whose turn it is",
    body: "Everyone sees the collector, their bank name, and account number — no chasing chats.",
  },
  {
    icon: Receipt,
    title: "Pay and upload your receipt",
    body: "Transfer bank-to-bank, then upload proof so the group stays on the same page.",
  },
];

export function LandingHowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-t border-primary-light/30 bg-surface/60 py-16"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">
          How it works
        </h2>
        <p className="mt-2 max-w-lg text-text-muted">
          Three steps. No money moves through the app.
        </p>
        <ol className="mt-10 grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className="relative">
              <span className="font-mono text-xs font-medium text-accent">
                Step {i + 1}
              </span>
              <div className="mt-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
                <step.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-text">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
