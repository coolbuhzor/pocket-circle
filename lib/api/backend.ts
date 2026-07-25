/**
 * Server-only helpers for talking to the NestJS API.
 * Never import this from client components.
 */

import { API_PREFIX } from "@/lib/api/constants";

/**
 * Origin of the NestJS API (no path).
 * Accepts either `https://host` or a mistaken `https://host/api/v1` and
 * normalizes to the origin so callers never double-prefix.
 */
export function getBackendUrl(): string {
  const url = process.env.BACKEND_URL;
  if (!url) {
    throw new Error(
      "BACKEND_URL is not set. Add it to .env.local (server-only, no NEXT_PUBLIC_ prefix).",
    );
  }

  let base = url.trim().replace(/\/$/, "");
  // Defensive: strip a trailing API prefix if someone put it in the env var.
  if (base.endsWith(API_PREFIX)) {
    base = base.slice(0, -API_PREFIX.length).replace(/\/$/, "");
  }
  return base;
}

/**
 * Build a full backend URL under the versioned API prefix.
 * @param path - Path relative to `/api/v1` (e.g. `me`, `auth/login`, `banks?foo=1`)
 */
export function backendApiUrl(path: string): string {
  const cleaned = path.replace(/^\//, "").replace(/^api\/v1\//, "");
  return `${getBackendUrl()}${API_PREFIX}/${cleaned}`;
}

export const AUTH_COOKIE = "pc_token";

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days — matches backend JWT expiry
};
