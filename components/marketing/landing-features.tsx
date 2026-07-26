import {
  Download,
  FileCheck2,
  Flag,
  History,
  MessageCircle,
  Timer,
  type LucideIcon,
} from "lucide-react";
import { RotationCircle } from "@/components/rotation-circle";
import { Reveal } from "@/components/marketing/reveal";
import { cn } from "@/lib/utils";

const ring = [
  { id: "1", name: "Amaka Obi" },
  { id: "2", name: "Tunde Bello" },
  { id: "3", name: "Zainab Musa" },
  { id: "4", name: "Chidi Eze" },
  { id: "5", name: "Ifeoma Nwosu" },
];

const cards: {
  icon: LucideIcon;
  title: string;
  body: string;
  wide?: boolean;
}[] = [
  {
    icon: FileCheck2,
    title: "Receipts stay attached",
    body: "A photo or PDF, the amount and an optional note, filed against the right cycle. No more hunting a screenshot from March.",
  },
  {
    icon: Flag,
    title: "Disputes have a paper trail",
    body: "The collector flags a payment with a written reason. The payer sees exactly what to fix and re-uploads. Nobody has to shout.",
  },
  {
    icon: MessageCircle,
    title: "Nudges land on WhatsApp",
    body: "Reminders open WhatsApp with the message pre-written, and log a notification in the app so it isn’t your word against theirs.",
    wide: true,
  },
  {
    icon: Timer,
    title: "Invites expire",
    body: "Shareable join links with a 30-day life. Members land at the end of the rotation, not in the middle of it.",
  },
  {
    icon: History,
    title: "Every cycle is kept",
    body: "Who collected, what period it covered, how many people paid. A year later the record is still there.",
  },
  {
    icon: Download,
    title: "Export a summary",
    body: "Pull a clean summary of any cycle when someone wants the numbers outside the app.",
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="scroll-mt-20 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
            What you get
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold leading-tight text-text sm:text-4xl">
            Small features, built from the arguments they prevent
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Reveal className="md:col-span-2">
            <div className="group flex h-full flex-col gap-6 overflow-hidden rounded-3xl border border-primary-light/40 bg-gradient-to-br from-primary to-[#2a2359] p-6 text-white sm:flex-row sm:items-center sm:p-8">
              <div className="shrink-0">
                <RotationCircle
                  members={ring}
                  collectorId="3"
                  size="md"
                  className="transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold">
                  You can see the whole rotation
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-primary-light">
                  Not a list buried in someone’s notes. A circle showing every
                  member, whose turn it is now, and who is next. Admins can
                  reorder it when life happens and somebody needs to swap.
                </p>
                <p className="mt-4 font-mono text-xs text-accent">
                  Zainab is collecting · Chidi is next
                </p>
              </div>
            </div>
          </Reveal>

          {cards.map((card, i) => (
            <Reveal
              key={card.title}
              delay={i * 60}
              className={cn(card.wide && "md:col-span-2 lg:col-span-1")}
            >
              <div className="h-full rounded-3xl border border-primary-light/30 bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary-light/60 hover:shadow-[0_18px_40px_-28px_rgba(33,28,61,0.6)]">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-light/25 text-primary">
                  <card.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-text">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {card.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
