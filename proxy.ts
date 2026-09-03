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

const GUEST_ONLY = new Set(["/login", "/signup"]);

/**
 * UX gate only — real auth is enforced by the NestJS API on each proxied call.
 * Next.js 16: `middleware` was renamed to `proxy`.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE)?.value;

  // Signed-in users shouldn't see login/signup forms.
  if (token && GUEST_ONLY.has(pathname)) {
    const rawNext = request.nextUrl.searchParams.get("next");
    const next =
      rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//")
        ? rawNext
        : "/dashboard";
    return NextResponse.redirect(new URL(next, request.url));
  }

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isProtected && !token) {
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
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ],
};
