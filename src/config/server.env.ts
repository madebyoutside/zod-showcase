import "server-only";
import { z } from "zod";

export const serverEnvSchema = z.object({
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
});
export type ServerEnv = z.infer<typeof serverEnvSchema>;

export const serverEnv = {
  DATABASE_URL: process.env.DATABASE_URL,
} as ServerEnv;
