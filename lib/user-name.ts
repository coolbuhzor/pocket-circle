/** Shape accepted by display-name helpers (API user or nested pick). */
export type NameParts = {
  firstName?: string | null;
  lastName?: string | null;
  middleName?: string | null;
  /** Legacy / computed display name from some API payloads. */
  name?: string | null;
};

/**
 * Build a display name from first / middle / last (mirrors backend getFullName).
 * Falls back to a legacy `name` field when structured parts are absent.
 */
export function getFullName(user: NameParts | null | undefined): string {
  if (!user) return "Unknown";

  const parts = [user.firstName, user.middleName, user.lastName]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part));

  if (parts.length > 0) return parts.join(" ");

  const legacy = user.name?.trim();
  return legacy || "Unknown";
}

/** First token for greetings — prefers `firstName`, else the first word of the full name. */
export function getFirstName(user: NameParts | null | undefined): string {
  const first = user?.firstName?.trim();
  if (first) return first;

  const full = getFullName(user);
  if (full === "Unknown") return full;
  return full.split(/\s+/)[0] ?? full;
}
