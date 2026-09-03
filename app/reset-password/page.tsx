"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthShell } from "@/components/auth-shell";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useResetPassword } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api/client";
import { PASSWORD_HINT, passwordSchema } from "@/lib/password";
import { KeyRound } from "lucide-react";

const RESET_TOKEN_INVALID = "This reset link is invalid.";
const RESET_TOKEN_EXPIRED = "This reset link has expired.";
const RESET_TOKEN_USED = "This reset link has already been used.";

const schema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

type TokenProblem = "invalid" | "expired" | "used";

function classifyResetError(message: string): TokenProblem | null {
  if (message === RESET_TOKEN_EXPIRED) return "expired";
  if (message === RESET_TOKEN_USED) return "used";
  if (message === RESET_TOKEN_INVALID) return "invalid";
  return null;
}

const PROBLEM_COPY: Record<
  TokenProblem,
  { title: string; message: string }
> = {
  invalid: {
    title: "Reset link invalid",
    message:
      "This reset link is invalid. Request a new one from the forgot-password page.",
  },
  expired: {
    title: "Reset link expired",
    message:
      "This reset link has expired. Reset links last 15 minutes — request a new one.",
  },
  used: {
    title: "Reset link already used",
    message:
      "This reset link has already been used. Request a new one if you still need to change your password.",
  },
};

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = (searchParams.get("token") ?? "").trim();
  const resetPassword = useResetPassword();
  const [tokenProblem, setTokenProblem] = useState<TokenProblem | null>(
    token ? null : "invalid",
  );
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const problem = useMemo(
    () => (tokenProblem ? PROBLEM_COPY[tokenProblem] : null),
    [tokenProblem],
  );

  async function onSubmit(values: FormValues) {
    try {
      await resetPassword.mutateAsync({
        token,
        password: values.password,
      });
      setDone(true);
    } catch (err) {
      const message =
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Could not reset password.";
      const classified = classifyResetError(message);
      if (classified) {
        setTokenProblem(classified);
        return;
      }
      setError("root", { message });
    }
  }

  if (problem) {
    return (
      <AuthShell>
        <div data-testid={`reset-token-${tokenProblem}`}>
          <EmptyState
            icon={<KeyRound className="h-6 w-6" />}
            title={problem.title}
            message={problem.message}
            actionLabel="Forgot password?"
            actionHref="/forgot-password"
          />
        </div>
      </AuthShell>
    );
  }

  if (done) {
    return (
      <AuthShell>
        <h1 className="font-display text-2xl font-semibold text-text">
          Password updated
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          You can now log in with your new password.
        </p>
        <Link href="/login" className="mt-6 block">
          <Button fullWidth>Log in</Button>
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <h1 className="font-display text-2xl font-semibold text-text">
        Set a new password
      </h1>
      <p className="mt-1 text-sm text-text-muted">{PASSWORD_HINT}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <Input
          label="New password"
          type="password"
          autoComplete="new-password"
          {...register("password")}
          error={errors.password?.message}
        />
        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        {errors.root && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
            {errors.root.message}
          </p>
        )}

        <Button
          type="submit"
          fullWidth
          disabled={isSubmitting || resetPassword.isPending}
        >
          {isSubmitting || resetPassword.isPending
            ? "Saving…"
            : "Update password"}
        </Button>
      </form>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
