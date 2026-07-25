"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/toast";
import { useAcceptInvite, useInvite } from "@/hooks/use-invites";
import { ApiError } from "@/lib/api/client";
import { formatNaira } from "@/lib/utils";

export default function InvitePage() {
  const params = useParams<{ token: string }>();
  const token = params.token;
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const {
    data: invite,
    isLoading,
    isError,
    error,
  } = useInvite(token);
  const acceptInvite = useAcceptInvite(token);

  const missing =
    isError &&
    error instanceof ApiError &&
    (error.status === 404 || error.status === 400);
  const expired = invite?.status === "expired";

  const groupName = invite?.group?.name ?? invite?.groupName;
  const amount =
    invite?.group?.contributionAmount ?? invite?.contributionAmount;
  const inviterName =
    invite?.invitedBy?.name ?? invite?.inviterName ?? "Someone";

  async function handleAccept() {
    if (!user) {
      router.push(`/login?next=/invite/${token}`);
      return;
    }
    try {
      const joined = await acceptInvite.mutateAsync();
      toast("You're in the group");
      router.push(`/groups/${joined.id}`);
    } catch (err) {
      toast(
        err instanceof Error
          ? err.message
          : "That invite link has expired. Ask the group admin to send a new one.",
        "error",
      );
    }
  }

  if (isLoading || authLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (missing || !invite) {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-16">
        <EmptyState
          icon={<Users className="h-6 w-6" />}
          title="Invite not found"
          message="This invite link isn't valid. Ask the group admin to send a new one."
          actionLabel="Go home"
          actionHref="/"
        />
      </div>
    );
  }

  if (expired) {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-16">
        <EmptyState
          icon={<Users className="h-6 w-6" />}
          title="Invite expired"
          message="That invite link has expired. Ask the group admin to send a new one."
          actionLabel="Go home"
          actionHref="/"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
      <div className="rounded-2xl border border-primary-light/30 bg-surface p-6 shadow-lg animate-[pc-scale-in_.45s_cubic-bezier(.16,.84,.44,1)] sm:p-8">
        <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light/40 text-primary">
          <span
            className="absolute inset-0 rounded-2xl bg-primary-light/50 animate-[pc-ring_2.8s_ease-out_infinite]"
            aria-hidden
          />
          <Users className="relative h-7 w-7" />
        </div>
        <h1 className="mt-5 text-center font-display text-2xl font-semibold text-text">
          Join {groupName ?? "this group"}
        </h1>
        <p className="mt-2 text-center text-sm text-text-muted">
          {inviterName} invited you to this savings circle.
        </p>
        {typeof amount === "number" && (
          <p className="mt-4 text-center font-mono text-sm text-text">
            {formatNaira(amount)} / month
          </p>
        )}

        <div className="mt-8 space-y-3">
          <Button
            fullWidth
            onClick={handleAccept}
            disabled={acceptInvite.isPending}
          >
            {user
              ? acceptInvite.isPending
                ? "Joining…"
                : "Accept invite"
              : "Log in to accept"}
          </Button>
          {!user && (
            <p className="text-center text-sm text-text-muted">
              New here?{" "}
              <Link
                href={`/signup?next=/invite/${token}`}
                className="font-medium text-secondary transition-colors hover:text-primary hover:underline"
              >
                Sign up first
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
