import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ForgotPasswordPage from "@/app/forgot-password/page";
import { ToastProvider } from "@/components/toast";

const writeText = vi.fn().mockResolvedValue(undefined);

function renderPage() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: 0 } },
  });
  return render(
    <QueryClientProvider client={client}>
      <ToastProvider>
        <ForgotPasswordPage />
      </ToastProvider>
    </QueryClientProvider>,
  );
}

describe("Forgot password page", () => {
  beforeEach(() => {
    writeText.mockClear();
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          ok: true,
          demoMode: true,
          delivered: false,
          deliveryNote:
            "Resend demo mode: no real email is being delivered. Resend test/sandbox keys can only send to the account owner’s verified address.",
          deliveryError: null,
          email: {
            to: "ada@example.com",
            subject: "Reset your Pocket Circle password",
            body: "http://localhost:3000/reset-password?token=abc123",
          },
        }),
      }),
    );
  });

  it("shows a copyable demo email payload after a successful request", async () => {
    renderPage();
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "ada@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send reset link" }));

    await waitFor(() => {
      expect(screen.getByTestId("email-payload-card")).toBeTruthy();
    });
    expect(screen.getByTestId("resend-demo-banner").textContent).toContain(
      "Resend demo mode",
    );
    expect(screen.getByText("ada@example.com")).toBeTruthy();
    expect(
      screen.getByText("Reset your Pocket Circle password"),
    ).toBeTruthy();

    fireEvent.click(screen.getByTestId("copy-entire-email"));
    expect(writeText).toHaveBeenCalled();
  });
});
