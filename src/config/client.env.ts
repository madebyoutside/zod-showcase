import { z } from "zod";

export const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_ENV: z.enum(["development", "preview", "staging", "production"]),
  NEXT_PUBLIC_APP_URL: z.url(),
});
export type ClientEnv = z.infer<typeof clientEnvSchema>;

export const clientEnv = {
  NEXT_PUBLIC_APP_ENV:
    process.env.NEXT_PUBLIC_APP_ENV ?? (process.env.NODE_ENV === "production" ? "production" : "development"),
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
} as ClientEnv;
