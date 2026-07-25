import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE, getBackendUrl } from "@/lib/api/backend";

type RouteContext = { params: Promise<{ path: string[] }> };

/** Public GET routes (signup bank picker, account resolve) — no cookie required. */
function isPublicGet(path: string[], method: string): boolean {
  if (method !== "GET") return false;
  if (path.length === 1 && path[0] === "banks") return true;
  if (path.length === 2 && path[0] === "banks" && path[1] === "resolve") {
    return true;
  }
  return false;
}

async function proxyRequest(
  request: Request,
  context: RouteContext,
): Promise<Response> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  const { path } = await context.params;
  const method = request.method.toUpperCase();

  if (!token && !isPublicGet(path, method)) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const incomingUrl = new URL(request.url);
  const targetUrl = `${getBackendUrl()}/api/v1/${path.join("/")}${incomingUrl.search}`;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("Content-Type", contentType);
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  // Never forward a client-supplied Authorization header (already overwritten above).

  const hasBody = method !== "GET" && method !== "HEAD";

  const init: RequestInit & { duplex?: "half" } = {
    method,
    headers,
    // Multipart: forward body stream as-is so the boundary stays intact.
    body: hasBody ? request.body : undefined,
    ...(path.length === 1 && path[0] === "banks" && method === "GET"
      ? { next: { revalidate: 3600 } }
      : { cache: "no-store" }),
  };
  if (hasBody) {
    init.duplex = "half";
  }

  const backendRes = await fetch(targetUrl, init);

  const responseHeaders = new Headers();
  const backendContentType = backendRes.headers.get("content-type");
  if (backendContentType) {
    responseHeaders.set("Content-Type", backendContentType);
  }

  return new NextResponse(backendRes.body, {
    status: backendRes.status,
    headers: responseHeaders,
  });
}

export async function GET(request: Request, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function POST(request: Request, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function PATCH(request: Request, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function DELETE(request: Request, context: RouteContext) {
  return proxyRequest(request, context);
}
