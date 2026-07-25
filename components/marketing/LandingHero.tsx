import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function LandingHero() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col justify-center px-4 py-12 sm:px-6 sm:py-16">
      <p className="font-display text-4xl font-semibold tracking-tight text-primary sm:text-5xl md:text-6xl">
        Pocket Circle
      </p>
      <h1 className="mt-4 max-w-2xl text-2xl font-semibold leading-snug text-text sm:text-3xl">
        Your Ajo group, digitised — without holding the money.
      </h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-text-muted sm:text-lg">
        Friends pool money monthly. One person collects. The role rotates. Pocket
        Circle shows whose turn it is and lets everyone log their receipt —
        transfers stay bank-to-bank.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/signup">
          <Button size="lg" className="w-full sm:w-auto">
            Create your account
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/login">
          <Button variant="secondary" size="lg" className="w-full sm:w-auto">
            Log in
          </Button>
        </Link>
      </div>
      <p className="mt-4 text-sm text-text-muted">
        We&apos;re new — built for Nigerian rotating savings groups who want
        clarity, not another wallet.
      </p>
    </section>
  );
}
