"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/Toast";

const schema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Use at least 8 characters"),
  bankName: z.string().min(2, "Enter your bank name"),
  accountNumber: z
    .string()
    .regex(/^\d{10}$/, "Account number should be 10 digits"),
});

type FormValues = z.infer<typeof schema>;

function SignupForm() {
  const { signup, user, loading } = useAuth();
  const router = useRouter();
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

  useEffect(() => {
    if (!loading && user) router.replace(next);
  }, [user, loading, router, next]);

  async function onSubmit(values: FormValues) {
    const result = await signup(values);
    if (result.error) {
      setError("root", { message: result.error });
      return;
    }
    toast("Account created");
    router.push(next);
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-primary-light/30 bg-surface p-6 shadow-sm sm:p-8">
        <h1 className="font-display text-2xl font-semibold text-text">
          Sign up
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Add your bank details once — they&apos;re shown when it&apos;s your turn
          to collect.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Input
            label="Full name"
            autoComplete="name"
            {...register("name")}
            error={errors.name?.message}
          />
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
            autoComplete="new-password"
            {...register("password")}
            error={errors.password?.message}
          />
          <Input
            label="Bank name"
            placeholder="e.g. GTBank"
            {...register("bankName")}
            error={errors.bankName?.message}
          />
          <Input
            label="Account number"
            inputMode="numeric"
            className="font-mono"
            {...register("accountNumber")}
            error={errors.accountNumber?.message}
          />

          {errors.root && (
            <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
              {errors.root.message}
            </p>
          )}

          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Already have an account?{" "}
          <Link
            href={next !== "/dashboard" ? `/login?next=${encodeURIComponent(next)}` : "/login"}
            className="font-medium text-secondary hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
