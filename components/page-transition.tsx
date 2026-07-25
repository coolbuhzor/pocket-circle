"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Re-keying on the pathname is what restarts the entrance animation — the
 * <main> element itself is never unmounted by the router.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <main key={pathname} className="pc-enter flex flex-1 flex-col">
      {children}
    </main>
  );
}
