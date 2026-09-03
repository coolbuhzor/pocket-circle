import { expect, test } from "@playwright/test";
import {
  signupViaBff,
  STRONG_PASSWORD,
  tokenFromResetBody,
  uniqueEmail,
} from "./helpers";

test.describe("Forgot password", () => {
  test("request shows demo payload, reset works, reused token is rejected", async ({
    page,
  }) => {
    const email = uniqueEmail("forgot");
    await signupViaBff(page, {
      email,
      password: "password123",
    });
    await page.request.post("/api/auth/logout");

    await page.goto("/login");
    await expect(
      page.getByRole("link", { name: "Forgot password?" }),
    ).toBeVisible();
    await page.getByRole("link", { name: "Forgot password?" }).click();
    await expect(page).toHaveURL(/\/forgot-password/);
    await expect(
      page.getByRole("heading", { name: "Forgot password?" }),
    ).toBeVisible();

    await page.getByLabel("Email").fill(email);
    await page.getByRole("button", { name: "Send reset link" }).click();

    const card = page.getByTestId("email-payload-card");
    await expect(card).toBeVisible();
    await expect(page.getByTestId("resend-demo-banner")).toContainText(
      "Resend demo mode",
    );
    await expect(card).toContainText(email);
    await expect(card).toContainText("Reset your Pocket Circle password");

    await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.getByTestId("copy-entire-email").click();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toContain(email);
    expect(copied).toContain("/reset-password?token=");

    const token = tokenFromResetBody(copied);

    await page.goto(`/reset-password?token=${token}`);
    await page.getByLabel("New password").fill(STRONG_PASSWORD);
    await page.getByLabel("Confirm password").fill(STRONG_PASSWORD);
    await page.getByRole("button", { name: "Update password" }).click();
    await expect(page.getByText("Password updated")).toBeVisible();

    await page.request.post("/api/auth/logout");
    await page.goto("/login");
    await page.getByRole("textbox", { name: "Email" }).fill(email);
    await page.getByRole("textbox", { name: "Password" }).fill(STRONG_PASSWORD);
    await page.getByRole("button", { name: "Log in" }).click();
    await expect(page).toHaveURL(/\/dashboard/);

    await page.goto(`/reset-password?token=${token}`);
    await page.getByLabel("New password").fill("Password2!");
    await page.getByLabel("Confirm password").fill("Password2!");
    await page.getByRole("button", { name: "Update password" }).click();
    await expect(page.getByText("Reset link already used")).toBeVisible();
    await expect(
      page.getByText("This reset link has already been used"),
    ).toBeVisible();
  });

  test("invalid tokens show a distinct message", async ({ page }) => {
    await page.goto("/reset-password");
    await expect(page.getByText("Reset link invalid")).toBeVisible();
    await expect(page.getByText("This reset link is invalid")).toBeVisible();

    await page.goto("/reset-password?token=not-a-real-token");
    await page.getByLabel("New password").fill(STRONG_PASSWORD);
    await page.getByLabel("Confirm password").fill(STRONG_PASSWORD);
    await page.getByRole("button", { name: "Update password" }).click();
    await expect(page.getByText("Reset link invalid")).toBeVisible();
  });
});
