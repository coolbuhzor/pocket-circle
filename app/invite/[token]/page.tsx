"use client";

import { useParams, useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/toast";
import { useAcceptInvite, useInvite } from "@/hooks/use-invites";
import { useGroups } from "@/hooks/use-groups";
import { ApiError } from "@/lib/api/client";
import { formatNaira } from "@/lib/utils";

const INVALID_INVITE_MESSAGE =
  "This invite link has expired or is invalid — ask the group admin to send a new one";

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
  const { data: groups, isLoading: groupsLoading } = useGroups({
    enabled: Boolean(user),
  });

  const fetchFailed =
    isError &&
    error instanceof ApiError &&
    (error.status === 404 || error.status === 400 || error.status === 410);
  const inviteInactive =
    invite?.status === "expired" || invite?.status === "accepted";

  const groupId = invite?.group?.id ?? invite?.groupId;
  const groupName = invite?.group?.name ?? invite?.groupName;
  const amount =
    invite?.group?.contributionAmount ?? invite?.contributionAmount;
  const inviterName =
    invite?.invitedBy?.name ?? invite?.inviterName ?? "Someone";

  const alreadyMember = Boolean(
    user && groupId && groups?.some((g) => g.id === groupId),
  );
  const invalid = fetchFailed || !invite || (inviteInactive && !alreadyMember);

  async function handleAccept() {
    try {
      const joined = await acceptInvite.mutateAsync();
      toast("You're in the group");
      router.push(`/groups/${joined.id}`);
    } catch (err) {
      const already =
        err instanceof ApiError &&
        (err.status === 409 || /already/i.test(err.message));
      toast(
        already
          ? "You're already in this group"
          : err instanceof Error
            ? err.message
            : INVALID_INVITE_MESSAGE,
        "error",
      );
      if (already && groupId) {
        router.push(`/groups/${groupId}`);
      }
    }
  }

  if (isLoading || authLoading || (user && groupsLoading)) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (invalid) {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-16">
        <EmptyState
          icon={<Users className="h-6 w-6" />}
          title="Invite unavailable"
          message={INVALID_INVITE_MESSAGE}
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
          {alreadyMember
            ? "You're already in this group"
            : `Join ${groupName ?? "this group"}`}
        </h1>
        {!alreadyMember && (
          <>
            <p className="mt-2 text-center text-sm text-text-muted">
              {inviterName} invited you to this savings circle.
            </p>
            {typeof amount === "number" && (
              <p className="mt-4 text-center font-mono text-sm text-text">
                {formatNaira(amount)} / month
              </p>
            )}
          </>
        )}
        {alreadyMember && (
          <p className="mt-2 text-center text-sm text-text-muted">
            {groupName
              ? `Head back to ${groupName} whenever you're ready.`
              : "Head back to the group whenever you're ready."}
          </p>
        )}

        <div className="mt-8 space-y-3">
          {alreadyMember && groupId ? (
            <Button fullWidth onClick={() => router.push(`/groups/${groupId}`)}>
              Go to group
            </Button>
          ) : user ? (
            <Button
              fullWidth
              onClick={handleAccept}
              disabled={acceptInvite.isPending}
            >
              {acceptInvite.isPending ? "Joining…" : "Accept invite"}
            </Button>
          ) : (
            <>
              <Button
                fullWidth
                onClick={() =>
                  router.push(
                    `/login?next=${encodeURIComponent(`/invite/${token}`)}`,
                  )
                }
              >
                Log in to join
              </Button>
              <Button
                fullWidth
                variant="secondary"
                onClick={() =>
                  router.push(
                    `/signup?next=${encodeURIComponent(`/invite/${token}`)}`,
                  )
                }
              >
                Sign up to join
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
