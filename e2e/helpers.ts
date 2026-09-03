import { expect, type Page } from "@playwright/test";

export const STRONG_PASSWORD = "Password1!";

export function uniqueEmail(prefix: string) {
  return `${prefix}.${Date.now()}@example.com`;
}

export async function signupViaBff(
  page: Page,
  opts: { email: string; password: string; firstName?: string },
) {
  const res = await page.request.post("/api/auth/signup", {
    data: {
      firstName: opts.firstName ?? "E2e",
      lastName: "User",
      email: opts.email,
      password: opts.password,
      bankName: "GTBank",
      bankCode: "058",
      accountNumber: "0123456789",
    },
  });
  expect(res.ok(), await res.text()).toBeTruthy();
}

export function tokenFromResetBody(body: string) {
  const match = body.match(/reset-password\?token=([A-Za-z0-9_-]+)/);
  if (!match) {
    throw new Error(`No reset token in email body:\n${body}`);
  }
  return decodeURIComponent(match[1]);
}
