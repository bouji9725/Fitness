"use client";

import { useActionState } from "react";
import Link from "next/link";
import Input from "@frontend/components/ui/Input";
import Button from "@frontend/components/ui/Button";
import FormField from "@frontend/components/ui/FormField";
import AuthBrandPanel from "@frontend/components/auth/AuthBrandPanel";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      <AuthBrandPanel />

      {/* Form column */}
      <div className="flex min-h-screen items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          {/* Mobile-only brand header */}
          <div className="mb-8 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-indigo-400/30 bg-indigo-500/15">
              <span className="text-base font-bold tracking-tight text-indigo-300">F</span>
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300">
              Fitsler
            </p>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Sign in to your account
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-indigo-300 transition hover:text-white">
                Create one
              </Link>
            </p>
          </div>

          <form action={formAction} className="space-y-4">
            {state?.error && (
              <p role="alert" className="rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {state.error}
              </p>
            )}

            <FormField label="Email" htmlFor="login-email">
              <Input
                id="login-email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                autoComplete="email"
              />
            </FormField>

            <div>
              <FormField label="Password" htmlFor="login-password">
                <Input
                  id="login-password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </FormField>
              <Link
                href="/password-reset"
                className="mt-2 inline-block text-sm text-slate-400 transition hover:text-indigo-300"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
