"use client";

import { useActionState } from "react";
import Link from "next/link";
import Input from "@frontend/components/ui/Input";
import Button from "@frontend/components/ui/Button";
import FormField from "@frontend/components/ui/FormField";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300">
            Fitsler
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            Sign in to your account
          </h1>
        </div>

        <form
          action={formAction}
          className="app-surface space-y-4 rounded-[var(--radius-xl)] p-6"
        >
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

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-indigo-300 transition hover:text-white"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
