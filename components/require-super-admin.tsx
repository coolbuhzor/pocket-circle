"use client";

import { redirect } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { RequireAuth } from "@/components/require-auth";

function SuperAdminGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user || user.isSuperAdmin !== true) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}

/** Auth + super-admin UX guard for /admin/* routes. */
export function RequireSuperAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <SuperAdminGate>{children}</SuperAdminGate>
    </RequireAuth>
  );
}
