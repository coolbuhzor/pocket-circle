"use client";

import { CopyableField } from "@/components/copyable-field";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/toast";
import type { EmailPayload } from "@/lib/api/types";

const DEFAULT_DEMO_NOTE =
  "Resend demo mode: no real email is being delivered. Resend test/sandbox keys can only send to the account owner’s verified address.";

export function formatEmailForClipboard(payload: EmailPayload): string {
  return `To: ${payload.to}\nSubject: ${payload.subject}\n\n${payload.body}`;
}

interface EmailPayloadCardProps {
  payload: EmailPayload;
  demoMode?: boolean;
  delivered?: boolean;
  deliveryNote?: string;
  deliveryError?: string | null;
}

export function EmailPayloadCard({
  payload,
  demoMode = true,
  delivered = false,
  deliveryNote,
  deliveryError,
}: EmailPayloadCardProps) {
  const { toast } = useToast();

  async function copyEntireEmail() {
    try {
      await navigator.clipboard.writeText(formatEmailForClipboard(payload));
      toast("Copied entire email to clipboard");
    } catch {
      toast("Could not copy. Try selecting the text instead.", "error");
    }
  }

  return (
    <div
      data-testid="email-payload-card"
      className="space-y-4 rounded-2xl border border-accent/40 bg-accent/10 p-4"
      role="status"
    >
      {demoMode && (
        <p
          data-testid="resend-demo-banner"
          className="rounded-lg bg-accent/20 px-3 py-2 text-sm font-medium text-text"
        >
          {deliveryNote?.trim() || DEFAULT_DEMO_NOTE}
        </p>
      )}
      {!delivered && demoMode && (
        <p className="text-xs text-text-muted">
          Copy the message below and share it yourself — Resend is not
          delivering this to a real inbox.
        </p>
      )}
      {deliveryError && (
        <p
          data-testid="resend-delivery-error"
          className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger"
        >
          {deliveryError}
        </p>
      )}
      <CopyableField label="To" value={payload.to} mono={false} />
      <CopyableField label="Subject" value={payload.subject} mono={false} />
      <CopyableField
        label="Body"
        value={payload.body}
        mono={false}
        multiline
      />
      <Button
        type="button"
        variant="secondary"
        data-testid="copy-entire-email"
        onClick={copyEntireEmail}
      >
        Copy entire email
      </Button>
    </div>
  );
}
