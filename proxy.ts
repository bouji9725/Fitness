import { auth } from "@/auth";

// Next.js 16 renamed middleware → proxy. This file is the equivalent of
// middleware.ts in Next.js 14/15. The proxy always runs on Node.js runtime.
export const proxy = auth;

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
