const HONORIFICS = new Set([
  "MR",
  "MRS",
  "MS",
  "MISS",
  "DR",
  "PROF",
  "ENGR",
  "CHIEF",
  "ALH",
  "ALHAJI",
  "ALHAJA",
  "BARR",
  "PST",
  "REV",
]);

/** Normalize a person/account name for comparison (NUBAN resolve ↔ form names). */
export function normalizePersonName(name: string): string {
  return name
    .toUpperCase()
    .replace(/[^A-Z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function nameTokens(name: string): string[] {
  return normalizePersonName(name)
    .split(" ")
    .filter((token) => token.length > 1 && !HONORIFICS.has(token));
}

/**
 * True when the resolved bank account name matches the user's entered name.
 * Order-independent: first + last must appear among account-name tokens
 * (common for Nigerian NUBAN responses like "OKAFOR CHIBUZOR").
 */
export function accountNameMatchesUser(
  accountName: string,
  parts: { firstName: string; lastName: string; middleName?: string },
): boolean {
  const account = nameTokens(accountName);
  if (account.length === 0) return false;

  const required = [parts.firstName, parts.lastName]
    .map((part) => normalizePersonName(part))
    .filter(Boolean);

  if (required.length < 2) return false;

  return required.every((part) =>
    account.some((token) => token === part || token.includes(part) || part.includes(token)),
  );
}
