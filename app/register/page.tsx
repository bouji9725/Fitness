"use client";

import { useActionState } from "react";
import Link from "next/link";
import Input from "@frontend/components/ui/Input";
import Button from "@frontend/components/ui/Button";
import FormField from "@frontend/components/ui/FormField";
import { registerAction } from "./actions";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerAction, null);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300">
            Fitsler
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            Create your account
          </h1>
        </div>

        <form
          action={formAction}
          className="app-surface space-y-4 rounded-[var(--radius-xl)] p-6"
        >
          {state?.error && (
            <p className="rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {state.error}
            </p>
          )}

          <FormField label="Name" htmlFor="register-name">
            <Input
              id="register-name"
              name="name"
              type="text"
              required
              placeholder="Your name"
              autoComplete="name"
            />
          </FormField>

          <FormField label="Email" htmlFor="register-email">
            <Input
              id="register-email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              autoComplete="email"
            />
          </FormField>

          <FormField label="Password" htmlFor="register-password">
            <Input
              id="register-password"
              name="password"
              type="password"
              required
              placeholder="Min. 8 characters"
              autoComplete="new-password"
            />
          </FormField>

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-indigo-300 transition hover:text-white"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
