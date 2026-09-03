import { NextResponse } from "next/server";
import { backendApiUrl } from "@/lib/api/backend";

export async function POST(request: Request) {
  let body: { token?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const res = await fetch(backendApiUrl("auth/reset-password"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token: body.token,
      password: body.password,
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return NextResponse.json(
      {
        message: data.message ?? "Could not reset password",
      },
      { status: res.status },
    );
  }

  return NextResponse.json(data);
}
