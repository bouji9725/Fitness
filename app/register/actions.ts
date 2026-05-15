"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { userStore } from "@backend/stores/user-store";

export type RegisterState = { error: string } | null;

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  if (!name || !email || !password) {
    return { error: "All fields are required." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const existing = await userStore.findByEmail(email);
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await userStore.create(email, passwordHash, name);

  redirect("/login");
}
