import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

describe("useDebouncedValue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebouncedValue("hello", 300));
    expect(result.current).toBe("hello");
  });

  it("updates only after the delay once the value settles", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 450),
      { initialProps: { value: "" } },
    );

    rerender({ value: "012345678" });
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(result.current).toBe("");

    rerender({ value: "0123456789" });
    act(() => {
      vi.advanceTimersByTime(449);
    });
    expect(result.current).toBe("");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("0123456789");
  });
});
