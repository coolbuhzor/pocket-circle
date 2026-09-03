import { API_PREFIX } from "@/lib/api/constants";

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

/** Path relative to `/api/v1` — strips a leading slash or accidental `api/v1/` prefix. */
function toBffPath(path: string): string {
  const cleaned = path.replace(/^\//, "").replace(/^api\/v1\//, "");
  return `${API_PREFIX}/${cleaned}`;
}

async function parseErrorMessage(res: Response): Promise<string> {
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
  return message;
}

/**
 * Browser → Next.js BFF proxy (`/api/v1/...`). Never talks to BACKEND_URL directly.
 * Pass paths relative to the versioned API, e.g. `groups`, `banks/resolve?…`.
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

  const res = await fetch(toBffPath(path), {
    ...rest,
    headers,
  });

  if (!res.ok) {
    throw new ApiError(res.status, await parseErrorMessage(res));
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

/** Auth routes (set/clear httpOnly cookie server-side, plus public password reset). */
export async function authFetch<T = unknown>(
  path: "login" | "signup" | "logout" | "forgot-password" | "reset-password",
  body?: unknown,
): Promise<T> {
  const res = await fetch(`/api/auth/${path}`, {
    method: "POST",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new ApiError(res.status, await parseErrorMessage(res));
  }

  return res.json() as Promise<T>;
}

/** Public invite lookup — no auth cookie required (BFF allows GET invites/:token). */
export async function fetchPublicInvite<T = unknown>(token: string): Promise<T> {
  return apiFetch<T>(`invites/${encodeURIComponent(token)}`);
}
