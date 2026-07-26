import Link from "next/link";
import { CircleDot } from "lucide-react";

const columns: { heading: string; links: { label: string; href: string }[] }[] =
  [
    {
      heading: "Product",
      links: [
        { label: "How it works", href: "/how-it-works" },
        { label: "What you get", href: "/#features" },
        { label: "Questions", href: "/#faq" },
        { label: "Under the hood", href: "/architecture" },
      ],
    },
    {
      heading: "Get started",
      links: [
        { label: "Create an account", href: "/signup" },
        { label: "Log in", href: "/login" },
        { label: "Open an invite link", href: "/login" },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Terms of Service", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
      ],
    },
  ];

const promises = [
  "We never hold or move your money",
  "Bank details stay inside your group",
  "Receipts belong to the people who paid",
];

export function LandingFooter() {
  return (
    <footer className="border-t border-primary-light/30 bg-primary text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-accent">
              <CircleDot className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-semibold">
              Pocket Circle
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-primary-light">
            A shared record for rotating savings: Ajo, Esusu, Adashe, whatever
            your people call it. The money keeps going bank to bank.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            Beta · shipping small changes weekly
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.heading}>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              {column.heading}
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-primary-light">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            What we won’t do
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-primary-light">
            {promises.map((promise) => (
              <li key={promise} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary-light" aria-hidden />
                {promise}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-xs text-primary-light sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {new Date().getFullYear()} Pocket Circle · Made in Lagos, Nigeria
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 lg:justify-end">
            <div className="flex gap-4">
              <Link href="/terms" className="transition-colors hover:text-white">
                Terms
              </Link>
              <Link
                href="/privacy"
                className="transition-colors hover:text-white"
              >
                Privacy
              </Link>
            </div>
            <p className="max-w-xl lg:text-right">
              Pocket Circle is a coordination tool, not a bank. We don’t hold
              deposits, offer credit, or move funds on anyone’s behalf.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
