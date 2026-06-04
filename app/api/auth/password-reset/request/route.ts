import { prisma } from "@backend/prisma/prisma";
import {
  apiErrorResponse,
  apiSuccessResponse,
} from "@backend/responses/api-response";
import { passwordResetRequestSchema } from "@backend/validation/schemas";
import { validate } from "@backend/validation/validate";
import { sendPasswordResetEmail } from "@backend/email/send-email";
import { checkPasswordResetRateLimit } from "@backend/auth/rate-limit";
import { createId } from "@shared/utils/create-id";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const validation = validate(passwordResetRequestSchema, body);

    if (!validation.ok) {
      return apiErrorResponse({
        status: 400,
        message: validation.error,
        details: validation.details,
      });
    }

    const email = validation.data.email.toLowerCase();

    // Rate limit: 3 attempts per 24 hours per email
    const rateLimit = await checkPasswordResetRateLimit(email);
    if (!rateLimit.allowed) {
      return apiErrorResponse({
        status: 429,
        message: "Too many password reset attempts. Please try again later.",
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists for security
      return apiSuccessResponse({
        message: "If an account with this email exists, a reset link has been sent.",
      });
    }

    // Delete any existing reset tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email },
    });

    // Generate a secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Store the reset token
    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expiresAt,
      },
    });

    // Build reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL || "https://fitness-seven-sage.vercel.app"}/login?resetToken=${token}`;

    // Send email
    const emailResult = await sendPasswordResetEmail(email, token, resetUrl);

    if (!emailResult.success) {
      console.error("Failed to send password reset email:", emailResult.error);
      return apiErrorResponse({
        status: 500,
        message: "Failed to send reset email. Please try again later.",
      });
    }

    return apiSuccessResponse({
      message: "If an account with this email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("[password-reset/request] error:", error);
    return apiErrorResponse({
      status: 500,
      message: "An error occurred. Please try again later.",
    });
  }
}
