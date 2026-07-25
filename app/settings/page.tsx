"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RequireAuth } from "@/components/require-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/toast";

const schema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  bankName: z.string().min(2, "Enter your bank name"),
  accountNumber: z
    .string()
    .regex(/^\d{10}$/, "Account number should be 10 digits"),
  notifyEmail: z.boolean(),
  notifyWhatsApp: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

function SettingsContent() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      bankName: user?.bankName ?? "",
      accountNumber: user?.accountNumber ?? "",
      notifyEmail: user?.notifyEmail ?? true,
      notifyWhatsApp: user?.notifyWhatsApp ?? true,
    },
  });

  async function onSubmit(values: FormValues) {
    const result = await updateProfile(values);
    if (result.error) {
      toast(result.error, "error");
      return;
    }
    toast("Settings saved");
  }

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-text">
        Account settings
      </h1>
      <p className="mt-1 text-sm text-text-muted">
        Keep your bank details current so collectors get paid the right account.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-4 rounded-2xl border border-primary-light/30 bg-surface p-5 shadow-sm sm:p-6"
      >
        <Input
          label="Full name"
          {...register("name")}
          error={errors.name?.message}
        />
        <Input
          label="Email"
          type="email"
          {...register("email")}
          error={errors.email?.message}
        />
        <Input
          label="Bank name"
          {...register("bankName")}
          error={errors.bankName?.message}
        />
        <Input
          label="Account number"
          className="font-mono"
          {...register("accountNumber")}
          error={errors.accountNumber?.message}
        />

        <fieldset className="space-y-3 border-t border-primary-light/30 pt-4">
          <legend className="text-sm font-medium text-text">
            Notifications
          </legend>
          <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 text-sm text-text transition-colors hover:bg-bg">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-primary-light text-primary transition-colors focus:ring-secondary"
              {...register("notifyEmail")}
            />
            Email me when it&apos;s someone&apos;s turn
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 text-sm text-text transition-colors hover:bg-bg">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-primary-light text-primary transition-colors focus:ring-secondary"
              {...register("notifyWhatsApp")}
            />
            WhatsApp reminders (coming soon)
          </label>
        </fieldset>

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <RequireAuth>
      <SettingsContent />
    </RequireAuth>
  );
}
