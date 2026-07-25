/**
 * NestJS global API prefix. The Next.js BFF catch-all mirrors this path
 * so browser URLs match backend routes (`/api/v1/...` → BACKEND_URL/api/v1/...).
 *
 * Safe to import from client or server code.
 */
export const API_PREFIX = "/api/v1";
