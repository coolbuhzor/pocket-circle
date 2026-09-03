import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import ResetPasswordPage from "@/app/reset-password/page";
import { ToastProvider } from "@/components/toast";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

function renderPage() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: 0 } },
  });
  return render(
    <QueryClientProvider client={client}>
      <ToastProvider>
        <ResetPasswordPage />
      </ToastProvider>
    </QueryClientProvider>,
  );
}

describe("Reset password page", () => {
  it("shows a distinct invalid-token state when the URL has no token", () => {
    renderPage();
    expect(screen.getByText("Reset link invalid")).toBeTruthy();
    expect(
      screen.getByText(/This reset link is invalid/),
    ).toBeTruthy();
  });
});
