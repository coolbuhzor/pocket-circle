import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  AUTH_COOKIE_OPTIONS,
  getBackendUrl,
} from "@/lib/api/backend";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  if (token) {
    try {
      await fetch(`${getBackendUrl()}/api/v1/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Backend logout is best-effort; always clear the cookie.
    }
  }

  cookieStore.set(AUTH_COOKIE, "", { ...AUTH_COOKIE_OPTIONS, maxAge: 0 });

  return NextResponse.json({ ok: true });
}
