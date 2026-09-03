"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { RequireAuth } from "@/components/require-auth";
import {
  CreateGroupDetailsStep,
  type CreateGroupDetailsValues,
} from "@/components/groups/create-group-details-step";
import {
  InviteLinkStep,
  StepIndicator,
} from "@/components/groups/invite-link-step";
import { useToast } from "@/components/toast";
import { useCreateGroup } from "@/hooks/use-groups";
import { apiFetch } from "@/lib/api/client";
import type { InviteSentResult } from "@/lib/api/types";

const detailsSchema = z.object({
  name: z.string().min(2, "Give your group a name"),
  contributionAmount: z
    .number({ error: "Enter how much each person contributes" })
    .positive("Enter how much each person contributes"),
  frequency: z.enum(["weekly", "biweekly", "monthly"]),
});

function CreateGroupContent() {
  const { toast } = useToast();
  const router = useRouter();
  const createGroup = useCreateGroup();
  const [step, setStep] = useState<1 | 2>(1);
  const [createdGroupId, setCreatedGroupId] = useState<string | null>(null);
  const [inviteEmails, setInviteEmails] = useState<string[]>([]);
  const [inviteLink, setInviteLink] = useState("");
  const [invitesSent, setInvitesSent] = useState<InviteSentResult[]>([]);
  const [finishing, setFinishing] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    getValues,
    setValue,
  } = useForm<CreateGroupDetailsValues>({
    resolver: zodResolver(detailsSchema),
    defaultValues: { frequency: "monthly", contributionAmount: 10000 },
  });

  const frequency = useWatch({ control, name: "frequency" });

  async function onDetailsSubmit() {
    const values = getValues();
    try {
      const group = await createGroup.mutateAsync({
        name: values.name,
        contributionAmount: values.contributionAmount,
        frequency: values.frequency,
        memberEmails: inviteEmails,
      });
      setCreatedGroupId(group.id);
      setInvitesSent(group.invitesSent ?? []);
      const invite = await apiFetch<{ token: string; url?: string }>(
        `groups/${group.id}/invites`,
        { method: "POST" },
      );
      setInviteLink(
        invite.url ?? `${window.location.origin}/invite/${invite.token}`,
      );
      setStep(2);
      toast("Group created");
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Could not create group",
        "error",
      );
    }
  }

  function finish() {
    if (!createdGroupId) return;
    setFinishing(true);
    router.push(`/groups/${createdGroupId}`);
  }

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-8 sm:px-6">
      <button
        type="button"
        onClick={() => (step === 1 ? router.push("/dashboard") : setStep(1))}
        className="group mb-4 inline-flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Back
      </button>

      <h1 className="font-display text-3xl font-semibold text-text">
        {step === 1 ? "Create a group" : "Invite members"}
      </h1>
      <p className="mt-1 text-sm text-text-muted">
        {step === 1
          ? "Set the basics. You can invite people next."
          : "Share a link or add emails of people already on Pocket Circle."}
      </p>

      <StepIndicator step={step} />

      <div key={step} className="pc-enter">
        {step === 1 && (
          <CreateGroupDetailsStep
            register={register}
            control={control}
            errors={errors}
            frequency={frequency}
            setValue={setValue}
            inviteEmails={inviteEmails}
            onInviteEmailsChange={setInviteEmails}
            onSubmit={handleSubmit(onDetailsSubmit)}
            submitting={isSubmitting || createGroup.isPending}
          />
        )}

        {step === 2 && (
          <InviteLinkStep
            inviteLink={inviteLink}
            invitesSent={invitesSent}
            finishing={finishing}
            onFinish={finish}
          />
        )}
      </div>
    </div>
  );
}

export default function CreateGroupPage() {
  return (
    <RequireAuth>
      <CreateGroupContent />
    </RequireAuth>
  );
}
