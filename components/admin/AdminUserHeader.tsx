import type { User } from "@/lib/api/types";
import { formatDate, getInitials } from "@/lib/utils";

interface AdminUserHeaderProps {
  user: User;
}

export function AdminUserHeader({ user }: AdminUserHeaderProps) {
  return (
    <div className="flex flex-wrap items-start gap-4 rounded-xl border border-primary-light/40 bg-surface p-4 sm:p-5">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
        {getInitials(user.name)}
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="font-display text-xl font-semibold text-text">
          {user.name}
        </h2>
        <p className="text-sm text-text-muted">{user.email}</p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs uppercase tracking-wide text-text-muted">
              Joined
            </dt>
            <dd className="mt-0.5 font-mono text-xs">
              {user.createdAt ? formatDate(user.createdAt) : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-text-muted">
              Last active
            </dt>
            <dd className="mt-0.5 font-mono text-xs">
              {user.lastLoginAt ? formatDate(user.lastLoginAt) : "Never"}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-text-muted">
              Bank
            </dt>
            <dd className="mt-0.5">{user.bankName}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-text-muted">
              Account
            </dt>
            <dd className="mt-0.5 font-mono text-xs">{user.accountNumber}</dd>
          </div>
        </dl>
        {user.isSuperAdmin && (
          <p className="mt-3 text-xs font-medium text-secondary">Super admin</p>
        )}
      </div>
    </div>
  );
}
