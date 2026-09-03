import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  EmailPayloadCard,
  formatEmailForClipboard,
} from "@/components/email-payload-card";
import { ToastProvider } from "@/components/toast";
import type { EmailPayload } from "@/lib/api/types";

const payload: EmailPayload = {
  to: "ada@example.com",
  subject: "You're invited to join Sunday Circle on Pocket Circle",
  body: "Accept the invite:\nhttp://localhost:3000/invite/abc-token",
};

const writeText = vi.fn().mockResolvedValue(undefined);

function renderCard(
  props: Partial<Parameters<typeof EmailPayloadCard>[0]> = {},
) {
  return render(
    <ToastProvider>
      <EmailPayloadCard
        payload={payload}
        demoMode
        delivered={false}
        {...props}
      />
    </ToastProvider>,
  );
}

describe("EmailPayloadCard", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    writeText.mockClear();
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
  });

  it("shows demo-mode messaging and the email payload", () => {
    renderCard({
      deliveryNote:
        "Resend demo mode: no real email is being delivered. Resend test/sandbox keys can only send to the account owner’s verified address.",
    });

    expect(screen.getByTestId("resend-demo-banner").textContent).toContain(
      "Resend demo mode: no real email is being delivered",
    );
    expect(screen.getByText(payload.to)).toBeTruthy();
    expect(screen.getByText(payload.subject)).toBeTruthy();
    expect(screen.getByText(/Accept the invite/)).toBeTruthy();
    expect(
      screen.getByText(/Resend is not delivering this to a real inbox/),
    ).toBeTruthy();
  });

  it("copies the entire email payload", () => {
    renderCard();
    fireEvent.click(screen.getByTestId("copy-entire-email"));
    expect(writeText).toHaveBeenCalledWith(formatEmailForClipboard(payload));
  });
});
