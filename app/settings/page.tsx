"use client";

import { useState, type ReactNode } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Lock } from "lucide-react";
import { BankDetailsFields } from "@/components/bank-details-fields";
import { RequireAuth } from "@/components/require-auth";
import { Tabs } from "@/components/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/toast";
import { useAuth } from "@/lib/auth";
import type { User } from "@/lib/api/types";
import { getFullName } from "@/lib/user-name";
import { cn, getInitials } from "@/lib/utils";

const profileSchema = z.object({
  firstName: z.string().min(1, "Enter your first name"),
  lastName: z.string().min(1, "Enter your last name"),
  middleName: z.string().optional(),
});

const preferencesSchema = z.object({
  bankCode: z.string().min(1, "Select your bank"),
  bankName: z.string().min(1, "Select your bank"),
  accountNumber: z
    .string()
    .regex(/^\d{10}$/, "Account number should be 10 digits"),
  notifyEmail: z.boolean(),
  notifyWhatsApp: z.boolean(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileValues = z.infer<typeof profileSchema>;
type PreferencesValues = z.infer<typeof preferencesSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

type TabId = "profile" | "preferences";

function SettingsCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-primary-light/30 bg-surface p-5 shadow-sm sm:p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

function ProfileSidebar({ user }: { user: User }) {
  const fullName = getFullName(user);

  return (
    <SettingsCard className="flex flex-col items-center text-center lg:sticky lg:top-24">
      <span className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-white">
        {getInitials(fullName)}
      </span>
      <h2 className="mt-4 font-display text-xl font-semibold text-text">
        {fullName}
      </h2>
      <p className="mt-1 text-sm text-text-muted">{user.email}</p>

      <dl className="mt-6 grid w-full grid-cols-2 gap-4 border-t border-primary-light/30 pt-5 text-left">
        <div>
          <dt className="text-[11px] font-medium uppercase tracking-wide text-text-muted">
            Status
          </dt>
          <dd className="mt-1 text-sm font-medium text-success">Active</dd>
        </div>
        <div>
          <dt className="text-[11px] font-medium uppercase tracking-wide text-text-muted">
            Role
          </dt>
          <dd className="mt-1 text-sm font-medium text-secondary">
            {user.isSuperAdmin ? "Super admin" : "Member"}
          </dd>
        </div>
      </dl>
    </SettingsCard>
  );
}

function PersonalInformationCard({ user }: { user: User }) {
  const { updateProfile } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      middleName: user.middleName ?? "",
    },
  });

  async function onSubmit(values: ProfileValues) {
    const result = await updateProfile({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      middleName: values.middleName?.trim() || null,
    });
    if (result.error) {
      toast(result.error, "error");
      return;
    }
    toast("Profile updated");
    setEditing(false);
  }

  function cancelEdit() {
    reset({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      middleName: user.middleName ?? "",
    });
    setEditing(false);
  }

  return (
    <SettingsCard>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-semibold text-text">
          Personal information
        </h3>
        {!editing ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="shrink-0 text-sm font-medium text-secondary transition-colors hover:text-primary"
          >
            Edit profile
          </button>
        ) : null}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="First name"
            autoComplete="given-name"
            disabled={!editing}
            {...register("firstName")}
            error={errors.firstName?.message}
          />
          <Input
            label="Last name"
            autoComplete="family-name"
            disabled={!editing}
            {...register("lastName")}
            error={errors.lastName?.message}
          />
        </div>
        <Input
          label="Middle name (optional)"
          autoComplete="additional-name"
          disabled={!editing}
          {...register("middleName")}
          error={errors.middleName?.message}
        />
        <Input
          label="Email address"
          type="email"
          value={user.email}
          disabled
          hint="Non-editable"
          readOnly
        />

        {editing ? (
          <div className="flex flex-wrap gap-3 pt-1">
            <Button
              type="button"
              variant="secondary"
              onClick={cancelEdit}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !isDirty}>
              {isSubmitting ? "Saving…" : "Save changes"}
            </Button>
          </div>
        ) : null}
      </form>
    </SettingsCard>
  );
}

function UpdatePasswordCard() {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(_values: PasswordValues) {
    toast("Password updates aren’t available yet", "info");
  }

  return (
    <SettingsCard>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-light/35 text-primary">
          <Lock className="h-4 w-4" aria-hidden />
        </span>
        <div>
          <h3 className="font-display text-lg font-semibold text-text">
            Update password
          </h3>
          <p className="mt-0.5 text-sm text-text-muted">
            Manage and secure your account credentials.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <Input
          label="Current password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter current password"
          {...register("currentPassword")}
          error={errors.currentPassword?.message}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="New password"
            type="password"
            autoComplete="new-password"
            placeholder="Min. 8 characters"
            {...register("newPassword")}
            error={errors.newPassword?.message}
          />
          <Input
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter new password"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />
        </div>
        <div className="flex flex-wrap gap-3 pt-1">
          <Button
            type="button"
            variant="secondary"
            onClick={() => reset()}
            disabled={isSubmitting}
          >
            Reset form
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Check className="h-4 w-4" aria-hidden />
            Update password
          </Button>
        </div>
      </form>
    </SettingsCard>
  );
}

function PreferencesPanel({ user }: { user: User }) {
  const { updateProfile } = useAuth();
  const { toast } = useToast();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PreferencesValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      bankCode: user.bankCode ?? "",
      bankName: user.bankName ?? "",
      accountNumber: user.accountNumber ?? "",
      notifyEmail: user.notifyEmail ?? true,
      notifyWhatsApp: user.notifyWhatsApp ?? true,
    },
  });

  const bankCode = useWatch({ control, name: "bankCode" }) ?? "";
  const accountNumber = useWatch({ control, name: "accountNumber" }) ?? "";

  async function onSubmit(values: PreferencesValues) {
    const result = await updateProfile({
      bankCode: values.bankCode,
      bankName: values.bankName,
      accountNumber: values.accountNumber,
      notifyEmail: values.notifyEmail,
      notifyWhatsApp: values.notifyWhatsApp,
    });
    if (result.error) {
      toast(result.error, "error");
      return;
    }
    toast("Preferences saved");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <SettingsCard>
        <h3 className="font-display text-lg font-semibold text-text">
          Bank details
        </h3>
        <p className="mt-1 text-sm text-text-muted">
          Keep these current so collectors get paid to the right account.
        </p>
        <div className="mt-5">
          <Controller
            name="bankCode"
            control={control}
            render={() => (
              <BankDetailsFields
                bankCode={bankCode}
                accountNumber={accountNumber}
                onBankChange={(bank) => {
                  setValue("bankCode", bank?.code ?? "", {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  setValue("bankName", bank?.name ?? "", {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                onAccountNumberChange={(value) =>
                  setValue("accountNumber", value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                bankError={
                  errors.bankCode?.message ?? errors.bankName?.message
                }
                accountError={errors.accountNumber?.message}
                authenticated
              />
            )}
          />
        </div>
      </SettingsCard>

      <SettingsCard>
        <h3 className="font-display text-lg font-semibold text-text">
          Notifications
        </h3>
        <fieldset className="mt-4 space-y-1">
          <legend className="sr-only">Notification preferences</legend>
          <Controller
            name="notifyEmail"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="notifyEmail"
                label="Email me when it's someone's turn"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Controller
            name="notifyWhatsApp"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="notifyWhatsApp"
                label="WhatsApp reminders (coming soon)"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </fieldset>
      </SettingsCard>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save preferences"}
      </Button>
    </form>
  );
}

function SettingsForm({ user }: { user: User }) {
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "preferences", label: "Preferences" },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-text">
          Account settings
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Manage your profile, bank details, and notification preferences.
        </p>
      </div>

      <div className="mt-6 max-w-md">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as TabId)}
        />
      </div>

      <div key={activeTab} className="pc-enter mt-6">
        {activeTab === "profile" ? (
          <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start">
            <ProfileSidebar user={user} />
            <div className="space-y-4">
              <PersonalInformationCard user={user} />
              <UpdatePasswordCard />
            </div>
          </div>
        ) : (
          <PreferencesPanel key={user.id} user={user} />
        )}
      </div>
    </div>
  );
}

function SettingsContent() {
  const { user } = useAuth();
  if (!user) return null;
  return <SettingsForm key={user.id} user={user} />;
}

export default function SettingsPage() {
  return (
    <RequireAuth>
      <SettingsContent />
    </RequireAuth>
  );
}
