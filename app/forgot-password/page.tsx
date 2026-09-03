"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthShell } from "@/components/auth-shell";
import { EmailPayloadCard } from "@/components/email-payload-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForgotPassword } from "@/hooks/use-auth";
import type { EmailSendResponse } from "@/lib/api/types";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

type FormValues = z.infer<typeof schema>;

function ForgotPasswordForm() {
  const forgotPassword = useForgotPassword();
  const [result, setResult] = useState<EmailSendResponse | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: FormValues) {
    try {
      const data = await forgotPassword.mutateAsync(values.email);
      setResult(data);
    } catch (err) {
      setError("root", {
        message:
          err instanceof Error
            ? err.message
            : "Could not request a password reset. Try again.",
      });
    }
  }

  if (result?.email) {
    return (
      <AuthShell>
        <h1 className="font-display text-2xl font-semibold text-text">
          Check the demo email
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          If an account exists for that address, a reset link was prepared.
        </p>
        <div className="mt-6">
          <EmailPayloadCard
            payload={result.email}
            demoMode={result.demoMode}
            delivered={result.delivered}
            deliveryNote={result.deliveryNote}
            deliveryError={result.deliveryError}
          />
        </div>
        <p className="mt-6 text-center text-sm text-text-muted">
          <Link
            href="/login"
            className="font-medium text-secondary transition-colors hover:text-primary hover:underline"
          >
            Back to log in
          </Link>
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <h1 className="font-display text-2xl font-semibold text-text">
        Forgot password?
      </h1>
      <p className="mt-1 text-sm text-text-muted">
        Enter the email on your account. We&apos;ll prepare a reset link.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-6 space-y-4"
      >
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          {...register("email")}
          error={errors.email?.message}
        />

        {errors.root && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
            {errors.root.message}
          </p>
        )}

        <Button
          type="submit"
          fullWidth
          disabled={isSubmitting || forgotPassword.isPending}
        >
          {isSubmitting || forgotPassword.isPending
            ? "Sending…"
            : "Send reset link"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        Remembered it?{" "}
        <Link
          href="/login"
          className="font-medium text-secondary transition-colors hover:text-primary hover:underline"
        >
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}
