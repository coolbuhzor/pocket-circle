export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ApiFetchOptions = RequestInit & {
  /** When true, skip default JSON Content-Type (e.g. FormData uploads). */
  formData?: boolean;
};

/**
 * Browser → Next.js BFF proxy. Never talks to BACKEND_URL directly.
 */
export async function apiFetch<T = unknown>(
  path: string,
  options?: ApiFetchOptions,
): Promise<T> {
  const { formData, headers: initHeaders, ...rest } = options ?? {};
  const headers = new Headers(initHeaders);

  if (!formData && !headers.has("Content-Type") && rest.body) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`/api/proxy/${path.replace(/^\//, "")}`, {
    ...rest,
    headers,
  });

  if (!res.ok) {
    let message = "Request failed";
    try {
      const err = (await res.json()) as { message?: string | string[] };
      if (Array.isArray(err.message)) {
        message = err.message.join(", ");
      } else if (err.message) {
        message = err.message;
      }
    } catch {
      // keep default
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

/** Auth routes (set/clear httpOnly cookie server-side). */
export async function authFetch<T = unknown>(
  path: "login" | "signup" | "logout",
  body?: unknown,
): Promise<T> {
  const res = await fetch(`/api/auth/${path}`, {
    method: "POST",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = "Request failed";
    try {
      const err = (await res.json()) as { message?: string | string[] };
      if (Array.isArray(err.message)) {
        message = err.message.join(", ");
      } else if (err.message) {
        message = err.message;
      }
    } catch {
      // keep default
    }
    throw new ApiError(res.status, message);
  }

  return res.json() as Promise<T>;
}

/** Public invite — no auth cookie required. */
export async function fetchPublicInvite<T = unknown>(token: string): Promise<T> {
  const res = await fetch(`/api/invites/${encodeURIComponent(token)}`);
  if (!res.ok) {
    let message = "Request failed";
    try {
      const err = (await res.json()) as { message?: string | string[] };
      if (Array.isArray(err.message)) {
        message = err.message.join(", ");
      } else if (err.message) {
        message = err.message;
      }
    } catch {
      // keep default
    }
    throw new ApiError(res.status, message);
  }
  return res.json() as Promise<T>;
}
