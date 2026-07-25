"use client";

import { RequireSuperAdmin } from "@/components/require-super-admin";
import { AdminNav } from "@/components/admin/admin-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireSuperAdmin>
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-2">
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
            Super admin
          </p>
          <h1 className="font-display text-2xl font-semibold text-text sm:text-3xl">
            Platform
          </h1>
        </div>
        <AdminNav />
        {children}
      </div>
    </RequireSuperAdmin>
  );
}
