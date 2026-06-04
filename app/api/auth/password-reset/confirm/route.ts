import { prisma } from "@backend/prisma/prisma";
import {
  apiErrorResponse,
  apiSuccessResponse,
} from "@backend/responses/api-response";
import { passwordResetConfirmSchema } from "@backend/validation/schemas";
import { validate } from "@backend/validation/validate";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const validation = validate(passwordResetConfirmSchema, body);

    if (!validation.ok) {
      return apiErrorResponse({
        status: 400,
        message: validation.error,
        details: validation.details,
      });
    }

    const { token, password } = validation.data;

    // Find the reset token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return apiErrorResponse({
        status: 400,
        message: "Invalid or expired reset token.",
      });
    }

    // Check if token has expired
    if (resetToken.expiresAt < new Date()) {
      // Delete expired token
      await prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      });

      return apiErrorResponse({
        status: 400,
        message: "Reset token has expired. Please request a new one.",
      });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: resetToken.email },
    });

    if (!user) {
      return apiErrorResponse({
        status: 400,
        message: "User not found.",
      });
    }

    // Hash the new password
    const passwordHash = await bcrypt.hash(password, 12);

    // Update user password and delete all reset tokens
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.deleteMany({
        where: { email: resetToken.email },
      }),
    ]);

    return apiSuccessResponse({
      message: "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("[password-reset/confirm] error:", error);
    return apiErrorResponse({
      status: 500,
      message: "An error occurred. Please try again later.",
    });
  }
}
