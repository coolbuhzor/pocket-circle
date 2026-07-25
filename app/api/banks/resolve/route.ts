import { NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/api/backend";

/**
 * Public account-name resolution for signup (and settings fallback).
 * The catch-all /api/proxy requires a cookie; signup does not.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const accountNumber = searchParams.get("accountNumber") ?? "";
  const bankCode = searchParams.get("bankCode") ?? "";

  const qs = new URLSearchParams({ accountNumber, bankCode });
  const res = await fetch(
    `${getBackendUrl()}/api/v1/banks/resolve?${qs.toString()}`,
    {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    },
  );

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
