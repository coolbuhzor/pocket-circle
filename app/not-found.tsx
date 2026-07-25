import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light/40 text-primary animate-[pc-float_5s_ease-in-out_infinite]">
        <span
          className="absolute inset-0 rounded-2xl bg-primary-light/50 animate-[pc-ring_3s_ease-out_infinite]"
          aria-hidden
        />
        <Compass className="relative h-7 w-7" />
      </div>
      <h1 className="mt-5 font-display text-3xl font-semibold text-text">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        That page doesn&apos;t exist. Head back home and try again from there.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/">
          <Button>Go home</Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="secondary">Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
