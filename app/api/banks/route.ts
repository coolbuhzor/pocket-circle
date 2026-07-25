import { NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/api/backend";

/**
 * Public bank list for signup (and settings fallback).
 * The catch-all /api/proxy requires a cookie; signup does not.
 */
export async function GET() {
  const res = await fetch(`${getBackendUrl()}/api/v1/banks`, {
    method: "GET",
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
