import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function LandingCta() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
        <h2 className="font-display text-2xl font-semibold text-text">
          Ready to run your circle clearly?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-text-muted">
          Sign up, create a group, and invite the people you already save with.
        </p>
        <div className="mt-6">
          <Link href="/signup">
            <Button size="lg">Get started</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer className="border-t border-primary-light/30 bg-primary text-white">
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:grid-cols-[1.4fr_1fr_1fr] sm:px-6">
        <div>
          <p className="font-display text-xl font-semibold">Pocket Circle</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-primary-light">
            Rotating group savings, made clear. We never hold or move your money
            — transfers stay bank-to-bank.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            Product
          </p>
          <ul className="mt-3 space-y-2 text-sm text-primary-light">
            <li>
              <Link href="/signup" className="hover:text-white">
                Sign up
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-white">
                Log in
              </Link>
            </li>
            <li>
              <Link href="/how-it-works" className="hover:text-white">
                How it works
              </Link>
            </li>
            <li>
              <Link href="/architecture" className="hover:text-white">
                Architecture
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            Trust
          </p>
          <ul className="mt-3 space-y-2 text-sm text-primary-light">
            <li>No wallet. No escrow.</li>
            <li>Bank details stay with your group.</li>
            <li>Receipts keep everyone honest.</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-4 text-xs text-primary-light sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} Pocket Circle</p>
          <p>Built for Nigerian Ajo & Esusu groups</p>
        </div>
      </div>
    </footer>
  );
}
