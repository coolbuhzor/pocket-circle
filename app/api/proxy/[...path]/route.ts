import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE, getBackendUrl } from "@/lib/api/backend";

type RouteContext = { params: Promise<{ path: string[] }> };

async function proxyRequest(
  request: Request,
  context: RouteContext,
): Promise<Response> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { path } = await context.params;
  const incomingUrl = new URL(request.url);
  const targetUrl = `${getBackendUrl()}/api/v1/${path.join("/")}${incomingUrl.search}`;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("Content-Type", contentType);
  }
  headers.set("Authorization", `Bearer ${token}`);
  // Never forward a client-supplied Authorization header (already overwritten above).

  const method = request.method.toUpperCase();
  const hasBody = method !== "GET" && method !== "HEAD";

  const init: RequestInit & { duplex?: "half" } = {
    method,
    headers,
    // Multipart: forward body stream as-is so the boundary stays intact.
    body: hasBody ? request.body : undefined,
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
