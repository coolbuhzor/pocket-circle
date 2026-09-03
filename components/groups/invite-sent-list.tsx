import { Check } from "lucide-react";
import { EmailPayloadCard } from "@/components/email-payload-card";
import type { InviteSentResult } from "@/lib/api/types";
import { inviteResultMessage } from "@/lib/invites";

interface InviteSentListProps {
  invites: InviteSentResult[];
}

export function InviteSentList({ invites }: InviteSentListProps) {
  if (invites.length === 0) return null;

  return (
    <div className="mt-6 border-t border-primary-light/25 pt-5">
      <h3 className="text-sm font-semibold text-text">Invites sent</h3>
      <ul className="mt-3 space-y-4">
        {invites.map((invite) => (
          <li key={invite.email} className="space-y-3">
            <div className="flex items-start gap-2 text-sm">
              {invite.matchedExistingUser ? (
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              ) : (
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-text-muted/50" />
              )}
              <p className="min-w-0">
                <span className="font-medium text-text">{invite.email}</span>{" "}
                <span className="text-text-muted">
                  {inviteResultMessage(invite.matchedExistingUser)}
                </span>
              </p>
            </div>
            {invite.emailPayload && (
              <EmailPayloadCard
                payload={invite.emailPayload}
                demoMode={invite.demoMode ?? true}
                delivered={invite.delivered ?? false}
                deliveryNote={invite.deliveryNote}
                deliveryError={invite.deliveryError}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
