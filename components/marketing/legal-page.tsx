import type { ReactNode } from "react";
import Link from "next/link";
import { LandingFooter } from "@/components/marketing/landing-footer";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="flex-1">
      <section className="border-b border-primary-light/30 bg-gradient-to-b from-primary-light/20 to-bg px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-medium text-accent">Legal</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-text sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-text-muted">Last updated {updated}</p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <div className="space-y-8 text-sm leading-relaxed text-text-muted [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-text [&_p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
          {children}
        </div>

        <p className="mt-12 border-t border-primary-light/30 pt-6 text-sm text-text-muted">
          Questions? Reach us at{" "}
          <a
            href="mailto:hello@pocketcircle.app"
            className="font-medium text-primary hover:underline"
          >
            hello@pocketcircle.app
          </a>
          .{" "}
          <Link href="/terms" className="font-medium text-primary hover:underline">
            Terms of Service
          </Link>
          {" · "}
          <Link
            href="/privacy"
            className="font-medium text-primary hover:underline"
          >
            Privacy Policy
          </Link>
        </p>
      </article>

      <LandingFooter />
    </div>
  );
}
