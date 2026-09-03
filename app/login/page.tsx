"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/toast";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

type FormValues = z.infer<typeof schema>;

function LoginForm() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: FormValues) {
    const result = await login(values.email, values.password);
    if (result.error) {
      setError("root", { message: result.error });
      return;
    }
    toast("Welcome back");
    // Full navigation so the new httpOnly session cookie is on the next
    // document request — soft nav left a half-logged-in state.
    window.location.assign(next);
  }

  return (
    <AuthShell>
      <h1 className="font-display text-2xl font-semibold text-text">Log in</h1>
      <p className="mt-1 text-sm text-text-muted">
        Welcome back to your circle.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          {...register("email")}
          error={errors.email?.message}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
          error={errors.password?.message}
        />
        <p className="-mt-2 text-right text-sm">
          <Link
            href="/forgot-password"
            className="font-medium text-secondary transition-colors hover:text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </p>

        {errors.root && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger animate-[pc-fade_.2s_ease-out]">
            {errors.root.message}
          </p>
        )}

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Logging in…" : "Log in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        Don&apos;t have an account?{" "}
        <Link
          href={
            next !== "/dashboard"
              ? `/signup?next=${encodeURIComponent(next)}`
              : "/signup"
          }
          className="font-medium text-secondary transition-colors hover:text-primary hover:underline"
        >
          Sign up
        </Link>
      </p>

      <p className="mt-4 text-center text-xs text-text-muted">
        <Link
          href="/terms"
          className="underline-offset-2 hover:text-primary hover:underline"
        >
          Terms
        </Link>
        <span className="mx-1.5 text-primary-light" aria-hidden>
          ·
        </span>
        <Link
          href="/privacy"
          className="underline-offset-2 hover:text-primary hover:underline"
        >
          Privacy
        </Link>
      </p>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
