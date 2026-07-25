import { z } from "zod";

/** Standard signup / change-password strength rules. */
export const passwordSchema = z
  .string()
  .min(8, "Use at least 8 characters")
  .regex(/[a-z]/, "Include a lowercase letter")
  .regex(/[A-Z]/, "Include an uppercase letter")
  .regex(/\d/, "Include a number")
  .regex(/[^A-Za-z0-9]/, "Include a special character");

export const PASSWORD_HINT =
  "At least 8 characters, with uppercase, lowercase, a number, and a special character";
