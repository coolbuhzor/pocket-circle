import { describe, expect, it } from "vitest";
import {
  accountNameMatchesUser,
  normalizePersonName,
} from "@/lib/bank-name-match";

describe("normalizePersonName", () => {
  it("uppercases and strips punctuation", () => {
    expect(normalizePersonName("Okafor, Chibuzor!")).toBe("OKAFOR CHIBUZOR");
  });
});

describe("accountNameMatchesUser", () => {
  it("matches when first and last appear in any order", () => {
    expect(
      accountNameMatchesUser("OKAFOR CHIBUZOR EMMANUEL", {
        firstName: "Chibuzor",
        lastName: "Okafor",
        middleName: "Emmanuel",
      }),
    ).toBe(true);
  });

  it("matches with honorifics in the resolve response", () => {
    expect(
      accountNameMatchesUser("MR OKAFOR CHIBUZOR", {
        firstName: "Chibuzor",
        lastName: "Okafor",
      }),
    ).toBe(true);
  });

  it("rejects when last name is missing from the account name", () => {
    expect(
      accountNameMatchesUser("CHIBUZOR EMMANUEL", {
        firstName: "Chibuzor",
        lastName: "Okafor",
      }),
    ).toBe(false);
  });

  it("rejects a completely different account name", () => {
    expect(
      accountNameMatchesUser("ADEBAYO TAYO", {
        firstName: "Chibuzor",
        lastName: "Okafor",
      }),
    ).toBe(false);
  });
});
