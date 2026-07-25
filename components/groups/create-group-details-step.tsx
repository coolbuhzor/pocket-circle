"use client";

import type {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { EmailTagsInput } from "@/components/ui/email-tags-input";
import { AmountInput } from "@/components/ui/amount-input";
import type { GroupFrequency } from "@/lib/api/types";
import { FREQUENCY_OPTIONS } from "@/lib/groups";

export type CreateGroupDetailsValues = {
  name: string;
  contributionAmount: number;
  frequency: GroupFrequency;
};

interface CreateGroupDetailsStepProps {
  register: UseFormRegister<CreateGroupDetailsValues>;
  control: Control<CreateGroupDetailsValues>;
  errors: FieldErrors<CreateGroupDetailsValues>;
  frequency: CreateGroupDetailsValues["frequency"];
  setValue: UseFormSetValue<CreateGroupDetailsValues>;
  inviteEmails: string[];
  onInviteEmailsChange: (emails: string[]) => void;
  onSubmit: () => void;
  submitting?: boolean;
}

export function CreateGroupDetailsStep({
  register,
  control,
  errors,
  frequency,
  setValue,
  inviteEmails,
  onInviteEmailsChange,
  onSubmit,
  submitting,
}: CreateGroupDetailsStepProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 space-y-4 rounded-2xl border border-primary-light/30 bg-surface p-5 shadow-sm sm:p-6"
    >
      <Input
        label="Group name"
        placeholder="e.g. Sunday Friends"
        {...register("name")}
        error={errors.name?.message}
      />
      <Controller
        name="contributionAmount"
        control={control}
        render={({ field }) => (
          <AmountInput
            label="Contribution amount (₦)"
            name={field.name}
            value={field.value}
            onBlur={field.onBlur}
            onChange={(value) => field.onChange(value ?? Number.NaN)}
            error={errors.contributionAmount?.message}
            placeholder="e.g. 10,000"
          />
        )}
      />
      <Select
        label="Frequency"
        name="frequency"
        value={frequency}
        onValueChange={(value) =>
          setValue("frequency", value as GroupFrequency, {
            shouldValidate: true,
          })
        }
        options={FREQUENCY_OPTIONS}
      />
      <EmailTagsInput
        label="Invite by email (optional)"
        emails={inviteEmails}
        onChange={onInviteEmailsChange}
        hint="Press Enter or comma to add each person. They don't need an account yet."
      />
      <Button type="submit" fullWidth disabled={submitting}>
        {submitting ? "Creating…" : "Continue"}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
}
