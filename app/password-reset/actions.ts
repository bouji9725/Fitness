"use server";

export type PasswordResetState =
  | { success: false; error: string }
  | { success: true }
  | null;

export async function passwordResetRequestAction(
  _prevState: PasswordResetState,
  formData: FormData
): Promise<PasswordResetState> {
  const email = (formData.get("email") as string | null)?.trim() ?? "";

  if (!email) {
    return { success: false, error: "Email is required." };
  }

  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/password-reset/request`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || "Failed to send reset email." };
    }

    return { success: true };
  } catch (err) {
    console.error("[password-reset/request] error:", err);
    return { success: false, error: "An error occurred. Please try again later." };
  }
}

export async function passwordResetConfirmAction(
  _prevState: PasswordResetState,
  formData: FormData,
  token: string | null
): Promise<PasswordResetState> {
  const password = (formData.get("password") as string | null) ?? "";

  if (!password) {
    return { success: false, error: "Password is required." };
  }

  if (!token) {
    return { success: false, error: "Reset token is missing. Please request a new reset link." };
  }

  if (password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." };
  }

  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/password-reset/confirm`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || "Failed to reset password." };
    }

    return { success: true };
  } catch (err) {
    console.error("[password-reset/confirm] error:", err);
    return { success: false, error: "An error occurred. Please try again later." };
  }
}
