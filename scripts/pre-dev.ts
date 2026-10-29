import { loadEnvConfig } from "@next/env";
import { z } from "zod";

loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");

const { clientEnv, clientEnvSchema } = await import("../src/config/client.env");
const { serverEnv, serverEnvSchema } = await import("../src/config/server.env");

const result = z
  .object({ client: clientEnvSchema, server: serverEnvSchema })
  .safeParse({ client: clientEnv, server: serverEnv });

if (!result.success) {
  console.error(`Invalid environment:\n${z.prettifyError(result.error)}`);
  process.exit(1);
}

console.log(`env ok: ${clientEnv.NEXT_PUBLIC_APP_ENV} @ ${clientEnv.NEXT_PUBLIC_APP_URL}`);
