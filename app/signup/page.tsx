"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { BankDetailsFields } from "@/components/bank-details-fields";
import { StepIndicator } from "@/components/step-indicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/toast";
import { PASSWORD_HINT, passwordSchema } from "@/lib/password";

const schema = z.object({
  firstName: z.string().min(1, "Enter your first name"),
  lastName: z.string().min(1, "Enter your last name"),
  middleName: z.string().optional(),
  email: z.string().email("Enter a valid email"),
  password: passwordSchema,
  bankCode: z.string().min(1, "Select your bank"),
  bankName: z.string().min(1, "Select your bank"),
  accountNumber: z
    .string()
    .regex(/^\d{10}$/, "Account number should be 10 digits"),
});

type FormValues = z.infer<typeof schema>;

const STEP1_FIELDS = [
  "firstName",
  "lastName",
  "middleName",
  "email",
  "password",
] as const;

function SignupForm() {
  const { signup } = useAuth();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2>(1);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
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
  const firstName = useWatch({ control, name: "firstName" }) ?? "";
  const lastName = useWatch({ control, name: "lastName" }) ?? "";
  const middleName = useWatch({ control, name: "middleName" }) ?? "";

  async function goToBankStep() {
    clearErrors("root");
    const ok = await trigger([...STEP1_FIELDS]);
    if (ok) setStep(2);
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
    // Full navigation so the new httpOnly session cookie is on the next
    // document request — soft nav left a half-logged-in state.
    window.location.assign(next);
  }

  return (
    <AuthShell>
      {step === 2 && (
        <button
          type="button"
          onClick={() => {
            clearErrors("root");
            setStep(1);
          }}
          className="group mb-4 inline-flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back
        </button>
      )}

      <h1 className="font-display text-2xl font-semibold text-text">
        {step === 1 ? "Create your account" : "Add your bank details"}
      </h1>
      <p className="mt-1 text-sm text-text-muted">
        {step === 1
          ? "A few details to get you into Pocket Circle."
          : "Shown when it's your turn to collect — money stays bank-to-bank."}
      </p>

      <StepIndicator step={step} />

      <form
        onSubmit={
          step === 1
            ? (e) => {
                e.preventDefault();
                void goToBankStep();
              }
            : handleSubmit(onSubmit)
        }
        className="mt-6 space-y-4"
        noValidate
      >
        <div key={step} className="space-y-4 pc-enter">
          {step === 1 && (
            <>
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
              <div>
                <Input
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  {...register("password")}
                  error={errors.password?.message}
                />
                {!errors.password && (
                  <p className="mt-1.5 text-xs text-text-muted">
                    {PASSWORD_HINT}
                  </p>
                )}
              </div>
            </>
          )}

          {step === 2 && (
            <Controller
              name="bankCode"
              control={control}
              render={() => (
                <BankDetailsFields
                  bankCode={bankCode}
                  accountNumber={accountNumber}
                  expectedName={{ firstName, lastName, middleName }}
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
                />
              )}
            />
          )}
        </div>

        {errors.root && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger animate-[pc-fade_.2s_ease-out]">
            {errors.root.message}
          </p>
        )}

        {step === 1 ? (
          <Button type="submit" fullWidth>
            Continue
          </Button>
        ) : (
          <>
            <p className="text-center text-xs leading-relaxed text-text-muted">
              By creating an account, you agree to our{" "}
              <Link
                href="/terms"
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
            <Button type="submit" fullWidth disabled={isSubmitting}>
              {isSubmitting ? "Creating account…" : "Create account"}
            </Button>
          </>
        )}
      </form>

      {step === 1 && (
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
      )}
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
