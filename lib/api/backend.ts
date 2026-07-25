/**
 * Server-only helpers for talking to the NestJS API.
 * Never import this from client components.
 */

export function getBackendUrl(): string {
  const url = process.env.BACKEND_URL;
  if (!url) {
    throw new Error(
      "BACKEND_URL is not set. Add it to .env.local (server-only, no NEXT_PUBLIC_ prefix).",
    );
  }
  return url.replace(/\/$/, "");
}

export const AUTH_COOKIE = "pc_token";

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days — matches backend JWT expiry
};
