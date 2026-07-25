import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  AUTH_COOKIE_OPTIONS,
  backendApiUrl,
} from "@/lib/api/backend";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  if (token) {
    try {
      await fetch(backendApiUrl("auth/logout"), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Backend logout is best-effort; always clear the cookie.
    }
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE, "", { ...AUTH_COOKIE_OPTIONS, maxAge: 0 });
  return response;
}
