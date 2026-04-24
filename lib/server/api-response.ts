import { NextResponse } from "next/server";

type ApiErrorResponseOptions = {
  status: number;
  message: string;
  details?: unknown;
};

// Server-side helper for consistent API error responses.
// Keep all API route errors shaped the same way.
export function apiErrorResponse({
  status,
  message,
  details,
}: ApiErrorResponseOptions) {
  return NextResponse.json(
    {
      error: {
        message,
        details: details ?? null,
      },
    },
    { status }
  );
}

export function apiSuccessResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}