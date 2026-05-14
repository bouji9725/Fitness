import { NextResponse } from "next/server";

type ApiErrorResponseOptions = {
  status: number;
  message: string;
  details?: unknown;
};

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
