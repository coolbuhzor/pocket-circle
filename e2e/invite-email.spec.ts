import { expect, test } from "@playwright/test";
import { signupViaBff, uniqueEmail } from "./helpers";

test.describe("Invite email demo payload", () => {
  test("creating an email invite shows payload, copy, and demo-mode messaging", async ({
    page,
  }) => {
    const email = uniqueEmail("admin");
    const invitee = uniqueEmail("invitee");
    await signupViaBff(page, {
      email,
      password: "password123",
      firstName: "Admin",
    });

    const create = await page.request.post("/api/v1/groups", {
      data: {
        name: `E2E Circle ${Date.now()}`,
        contributionAmount: 5000,
        frequency: "monthly",
      },
    });
    expect(create.ok(), await create.text()).toBeTruthy();
    const group = (await create.json()) as { id: string };

    await page.goto(`/groups/${group.id}`);
    await expect(page.getByRole("heading", { name: /E2E Circle/ })).toBeVisible();
    await page.getByRole("tab", { name: "Settings" }).click();
    await expect(
      page.getByRole("heading", { name: "Invite members" }),
    ).toBeVisible();

    await page.getByLabel("Invite by email (optional)").fill(invitee);
    await page.getByRole("button", { name: "Generate invite link" }).click();

    const card = page.getByTestId("email-payload-card");
    await expect(card).toBeVisible();
    await expect(page.getByTestId("resend-demo-banner")).toContainText(
      "Resend demo mode",
    );
    await expect(card).toContainText(invitee);
    await expect(card).toContainText("invited to join");

    await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.getByTestId("copy-entire-email").click();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toContain(invitee);
    expect(copied).toMatch(/\/invite\//);
  });
});
