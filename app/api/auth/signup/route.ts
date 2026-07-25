import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  AUTH_COOKIE_OPTIONS,
  getBackendUrl,
} from "@/lib/api/backend";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const res = await fetch(`${getBackendUrl()}/api/v1/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return NextResponse.json(
      { message: data.message ?? "Signup failed" },
      { status: res.status },
    );
  }

  const { user, accessToken } = data as {
    user: unknown;
    accessToken?: string;
  };

  if (!accessToken) {
    return NextResponse.json(
      { message: "Signup response missing accessToken" },
      { status: 502 },
    );
  }

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, accessToken, AUTH_COOKIE_OPTIONS);

  return NextResponse.json({ user });
}
