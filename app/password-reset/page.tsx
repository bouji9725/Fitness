"use client";

import { Suspense, useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Input from "@frontend/components/ui/Input";
import Button from "@frontend/components/ui/Button";
import FormField from "@frontend/components/ui/FormField";
import AuthBrandPanel from "@frontend/components/auth/AuthBrandPanel";
import {
  passwordResetRequestAction,
  passwordResetConfirmAction,
  type PasswordResetState,
} from "./actions";

function PasswordResetContent() {
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("resetToken");
  const [step, setStep] = useState<"request" | "confirm">(
    resetToken ? "confirm" : "request"
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      <AuthBrandPanel />

      {/* Form column */}
      <div className="flex min-h-screen items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          {/* Mobile-only brand header */}
          <div className="mb-8 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-indigo-400/30 bg-indigo-500/15">
              <span className="text-base font-bold tracking-tight text-indigo-300">
                F
              </span>
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300">
              Fitsler
            </p>
          </div>

          {step === "request" ? (
            <RequestStep setStep={setStep} />
          ) : (
            <ConfirmStep resetToken={resetToken} setStep={setStep} />
          )}
        </div>
      </div>
    </div>
  );
}

function RequestStep({
  setStep,
}: {
  setStep: (step: "request" | "confirm") => void;
}) {
  const [state, formAction, pending] = useActionState(
    passwordResetRequestAction,
    null
  );

  if (state?.success) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Check your email
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            We&apos;ve sent a password reset link to your email address.
          </p>
        </div>

        <div className="space-y-4 rounded-xl border border-green-400/25 bg-green-500/10 p-4">
          <p className="text-sm text-green-200">
            Click the link in your email to reset your password. The link
            expires in 1 hour.
          </p>
        </div>

        <div className="mt-6">
          <p className="text-sm text-slate-400">
            Back to{" "}
            <Link
              href="/login"
              className="text-indigo-300 transition hover:text-white"
            >
              sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Reset your password
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        {state && "error" in state && (
          <p
            role="alert"
            className="rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200"
          >
            {state.error}
          </p>
        )}

        <FormField label="Email" htmlFor="reset-email">
          <Input
            id="reset-email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            autoComplete="email"
          />
        </FormField>

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Sending link…" : "Send reset link"}
        </Button>
      </form>

      <div className="mt-6">
        <p className="text-sm text-slate-400">
          Back to{" "}
          <Link
            href="/login"
            className="text-indigo-300 transition hover:text-white"
          >
            sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

function ConfirmStep({
  resetToken,
  setStep,
}: {
  resetToken: string | null;
  setStep: (step: "request" | "confirm") => void;
}) {
  const [state, formAction, pending] = useActionState(
    (prevState: PasswordResetState, formData: FormData) =>
      passwordResetConfirmAction(prevState, formData, resetToken),
    null as PasswordResetState
  );

  if (state?.success) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Password reset successfully
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Your password has been reset. You can now sign in with your new
            password.
          </p>
        </div>

        <Link href="/login">
          <Button className="w-full">Go to sign in</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Create a new password
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Enter your new password below.
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        {state && "error" in state && (
          <p
            role="alert"
            className="rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200"
          >
            {state.error}
          </p>
        )}

        <FormField label="New Password" htmlFor="reset-password">
          <Input
            id="reset-password"
            name="password"
            type="password"
            required
            placeholder="Min. 8 characters"
            autoComplete="new-password"
          />
        </FormField>

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Resetting password…" : "Reset password"}
        </Button>
      </form>

      <div className="mt-6">
        <p className="text-sm text-slate-400">
          Back to{" "}
          <Link
            href="/login"
            className="text-indigo-300 transition hover:text-white"
          >
            sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function PasswordResetPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <PasswordResetContent />
    </Suspense>
  );
}
