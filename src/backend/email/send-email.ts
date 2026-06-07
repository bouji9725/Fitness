import { Resend } from "resend";

let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not configured.");
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

const FROM_EMAIL = process.env.RESEND_EMAIL_FROM || "onboarding@resend.dev";

/**
 * Send password reset email with a token
 */
export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  resetUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await getResendClient().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Reset your Fitsler password",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #020617; font-size: 24px; margin-bottom: 16px;">Reset your password</h1>
          <p style="color: #475569; font-size: 16px; line-height: 1.5; margin-bottom: 16px;">
            We received a request to reset your Fitsler password. Click the link below to set a new password:
          </p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #818cf8; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-bottom: 24px;">
            Reset Password
          </a>
          <p style="color: #64748b; font-size: 14px; margin-bottom: 12px;">
            Or copy and paste this link in your browser:
          </p>
          <p style="color: #64748b; font-size: 14px; word-break: break-all; margin-bottom: 24px;">
            ${resetUrl}
          </p>
          <p style="color: #94a3b8; font-size: 13px; margin-bottom: 8px;">
            This link expires in 1 hour.
          </p>
          <p style="color: #94a3b8; font-size: 13px;">
            If you didn't request this, you can safely ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
          <p style="color: #94a3b8; font-size: 12px;">
            © 2026 Fitsler. All rights reserved.
          </p>
        </div>
      `,
    });

    if (response.error) {
      console.error("Failed to send password reset email:", response.error);
      return {
        success: false,
        error: "Failed to send email",
      };
    }

    return { success: true };
  } catch (err) {
    console.error("Email send error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await getResendClient().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Welcome to Fitsler!",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #020617; font-size: 24px; margin-bottom: 8px;">Welcome to Fitsler, ${name}!</h1>
          <p style="color: #475569; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
            Your fitness tracking account is ready. Log workouts, track progress, and reach your goals.
          </p>
          <a href="https://fitness-seven-sage.vercel.app/dashboard" style="display: inline-block; background-color: #818cf8; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            Go to Fitsler
          </a>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
          <p style="color: #94a3b8; font-size: 12px;">
            © 2026 Fitsler. All rights reserved.
          </p>
        </div>
      `,
    });

    if (response.error) {
      console.error("Failed to send welcome email:", response.error);
      return {
        success: false,
        error: "Failed to send email",
      };
    }

    return { success: true };
  } catch (err) {
    console.error("Email send error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
