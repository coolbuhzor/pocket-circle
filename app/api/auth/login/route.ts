import { NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  AUTH_COOKIE_OPTIONS,
  backendApiUrl,
} from "@/lib/api/backend";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const res = await fetch(backendApiUrl("auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: body.email,
      password: body.password,
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return NextResponse.json(
      { message: data.message ?? "Login failed" },
      { status: res.status },
    );
  }

  const { user, accessToken } = data as {
    user: unknown;
    accessToken?: string;
  };

  if (!accessToken) {
    return NextResponse.json(
      { message: "Login response missing accessToken" },
      { status: 502 },
    );
  }

  // Set cookie on the response so the browser always receives Set-Cookie
  // before the client navigates to a protected route.
  const response = NextResponse.json({ user });
  response.cookies.set(AUTH_COOKIE, accessToken, AUTH_COOKIE_OPTIONS);
  return response;
}
