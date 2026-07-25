import { NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/api/backend";

type RouteContext = { params: Promise<{ token: string }> };

/**
 * Public (unauthenticated) invite lookup.
 * The catch-all /api/v1 requires a cookie; invites do not.
 */
export async function GET(_request: Request, context: RouteContext) {
  const { token } = await context.params;

  const res = await fetch(
    `${getBackendUrl()}/api/v1/invites/${encodeURIComponent(token)}`,
    { method: "GET", headers: { Accept: "application/json" } },
  );

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
