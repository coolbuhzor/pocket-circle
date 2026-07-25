import { Check, Clock } from "lucide-react";
import { Reveal } from "@/components/marketing/reveal";
import { cn } from "@/lib/utils";

const chat = [
  { from: "Bola", time: "9:12 PM", text: "Abeg who never send own for this month?" },
  { from: "Chidi", time: "9:14 PM", text: "I sent mine since last week o" },
  { from: "Amaka", time: "9:15 PM", text: "Send the screenshot again, I no see am", mine: true },
  { from: "Zainab", time: "9:31 PM", text: "Which account are we using this time?" },
  { from: "Bola", time: "11:47 PM", text: "So na me remain? 😩" },
];

const ledger = [
  { name: "Chidi Eze", note: "Receipt · 12 Jul", status: "paid" as const },
  { name: "Zainab Musa", note: "Receipt · 12 Jul", status: "paid" as const },
  { name: "Tunde Bello", note: "Nudged yesterday", status: "pending" as const },
  { name: "Bola Sanni", note: "Due 28 Jul", status: "pending" as const },
];

export function LandingProblem() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
          Sound familiar?
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold leading-tight text-text sm:text-4xl">
          The savings works. The record-keeping is where it breaks.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-muted">
          Most circles run on a group chat, one person’s memory, and a lot of
          scrolling. Nobody is being dishonest — the information is just spread
          across two hundred messages.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-8">
        <Reveal>
          <div className="h-full rounded-3xl border border-primary-light/30 bg-surface/70 p-5 sm:p-6">
            <p className="mb-5 text-xs font-semibold uppercase tracking-wide text-text-muted">
              Tonight, in the group chat
            </p>
            <div className="space-y-3">
              {chat.map((msg) => (
                <div
                  key={msg.text}
                  className={cn("flex", msg.mine && "justify-end")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm",
                      msg.mine
                        ? "rounded-br-sm bg-primary/90 text-white"
                        : "rounded-bl-sm bg-bg text-text",
                    )}
                  >
                    {!msg.mine && (
                      <p className="text-[11px] font-semibold text-secondary">
                        {msg.from}
                      </p>
                    )}
                    <p className="mt-0.5 leading-snug">{msg.text}</p>
                    <p
                      className={cn(
                        "mt-1 text-right font-mono text-[10px]",
                        msg.mine ? "text-white/60" : "text-text-muted",
                      )}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs text-text-muted">
              <Clock className="h-3.5 w-3.5" />
              Two hours later, still nobody knows the real answer.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="h-full rounded-3xl border border-primary-light/40 bg-surface p-5 shadow-[0_18px_50px_-30px_rgba(33,28,61,0.5)] sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                Same group, in Pocket Circle
              </p>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 font-mono text-[11px] text-primary">
                Cycle 7
              </span>
            </div>
            <ul className="divide-y divide-primary-light/25">
              {ledger.map((row) => (
                <li
                  key={row.name}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-text">{row.name}</p>
                    <p className="font-mono text-[11px] text-text-muted">
                      {row.note}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold",
                      row.status === "paid"
                        ? "bg-success/15 text-success"
                        : "bg-pending/20 text-pending",
                    )}
                  >
                    {row.status === "paid" ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Clock className="h-3.5 w-3.5" />
                    )}
                    {row.status === "paid" ? "Paid" : "Pending"}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-5 rounded-2xl bg-bg p-4">
              <p className="text-sm leading-relaxed text-text">
                Everyone sees the same list. The collector confirms receipts,
                flags the ones that don’t add up, and closes the cycle when
                it’s done.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
