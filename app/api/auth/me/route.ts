import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE, getBackendUrl } from "@/lib/api/backend";

/**
 * Soft session check — returns `{ user: null }` when unauthenticated
 * instead of a 401, so public pages can hydrate without error noise.
 */
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  const res = await fetch(`${getBackendUrl()}/api/v1/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    return NextResponse.json({ user: null });
  }

  const user = await res.json();
  return NextResponse.json({ user });
}
