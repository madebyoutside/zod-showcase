import { DrizzleQueryError } from "drizzle-orm/errors";

const UNIQUE_VIOLATION = "23505";

export function isUniqueViolation(error: unknown) {
  return (
    error instanceof DrizzleQueryError && (error.cause as { code?: string } | undefined)?.code === UNIQUE_VIOLATION
  );
}
