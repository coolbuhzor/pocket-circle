import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = "pc_token";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/groups",
  "/settings",
  "/notifications",
  "/admin",
];

/**
 * UX gate only — real auth is enforced by the NestJS API on each proxied call.
 * Next.js 16: `middleware` was renamed to `proxy`.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE)?.value;
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/groups/:path*",
    "/settings/:path*",
    "/notifications/:path*",
    "/admin/:path*",
  ],
};
