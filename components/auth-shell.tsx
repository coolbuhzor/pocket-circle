import type { ReactNode } from "react";

/** Soft, animated backdrop shared by the log in and sign up screens. */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-10">
      <div className="pc-grid absolute inset-0 -z-20" aria-hidden />
      <div
        className="absolute -left-24 top-0 -z-10 h-72 w-72 rounded-full bg-primary-light/40 blur-3xl animate-[pc-drift_20s_ease-in-out_infinite]"
        aria-hidden
      />
      <div
        className="absolute -right-20 bottom-0 -z-10 h-64 w-64 rounded-full bg-accent/20 blur-3xl animate-[pc-drift_26s_ease-in-out_infinite_reverse]"
        aria-hidden
      />
      <div className="w-full max-w-md rounded-2xl border border-primary-light/30 bg-surface/95 p-6 shadow-[0_24px_60px_-32px_rgba(33,28,61,0.45)] backdrop-blur-sm animate-[pc-scale-in_.45s_cubic-bezier(.16,.84,.44,1)] sm:p-8">
        {children}
      </div>
    </div>
  );
}
