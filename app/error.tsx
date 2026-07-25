"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);

  return (
    <div className="pc-enter mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
        <span
          className="absolute inset-0 rounded-2xl bg-danger/15 animate-[pc-ring_3s_ease-out_infinite]"
          aria-hidden
        />
        <AlertTriangle className="relative h-7 w-7" />
      </div>
      <h1 className="mt-5 font-display text-3xl font-semibold text-text">
        Something went wrong
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        We hit an unexpected error. Try again, or go back home if it keeps
        happening.
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Link href="/">
          <Button variant="secondary">Go home</Button>
        </Link>
      </div>
    </div>
  );
}
