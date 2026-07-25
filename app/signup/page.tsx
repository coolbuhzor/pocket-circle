"use client";

import Link from "next/link";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthShell } from "@/components/auth-shell";
import { BankDetailsFields } from "@/components/bank-details-fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/toast";

const schema = z.object({
  firstName: z.string().min(1, "Enter your first name"),
  lastName: z.string().min(1, "Enter your last name"),
  middleName: z.string().optional(),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Use at least 8 characters"),
  bankCode: z.string().min(1, "Select your bank"),
  bankName: z.string().min(1, "Select your bank"),
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
    control,
    setValue,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      password: "",
      bankCode: "",
      bankName: "",
      accountNumber: "",
    },
  });

  const bankCode = useWatch({ control, name: "bankCode" }) ?? "";
  const accountNumber = useWatch({ control, name: "accountNumber" }) ?? "";

  if (!loading && user) {
    redirect(next);
  }

  async function onSubmit(values: FormValues) {
    const result = await signup({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      middleName: values.middleName?.trim() || undefined,
      email: values.email.trim(),
      password: values.password,
      bankCode: values.bankCode,
      bankName: values.bankName,
      accountNumber: values.accountNumber,
    });
    if (result.error) {
      setError("root", { message: result.error });
      return;
    }
    toast("Account created");
    router.push(next);
  }

  return (
    <AuthShell>
      <h1 className="font-display text-2xl font-semibold text-text">Sign up</h1>
      <p className="mt-1 text-sm text-text-muted">
        Add your bank details once — they&apos;re shown when it&apos;s your turn
        to collect.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="First name"
            autoComplete="given-name"
            {...register("firstName")}
            error={errors.firstName?.message}
          />
          <Input
            label="Last name"
            autoComplete="family-name"
            {...register("lastName")}
            error={errors.lastName?.message}
          />
        </div>
        <Input
          label="Middle name (optional)"
          autoComplete="additional-name"
          {...register("middleName")}
          error={errors.middleName?.message}
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
              bankError={errors.bankCode?.message ?? errors.bankName?.message}
              accountError={errors.accountNumber?.message}
            />
          )}
        />

        {errors.root && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger animate-[pc-fade_.2s_ease-out]">
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
          href={
            next !== "/dashboard"
              ? `/login?next=${encodeURIComponent(next)}`
              : "/login"
          }
          className="font-medium text-secondary transition-colors hover:text-primary hover:underline"
        >
          Log in
        </Link>
      </p>
    </AuthShell>
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
