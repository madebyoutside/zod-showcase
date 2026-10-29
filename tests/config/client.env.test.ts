import { expect, test } from "bun:test";

import { clientEnvSchema } from "@/config/client.env";

test("clientEnvSchema rejects an unknown APP_ENV and a relative URL", () => {
  const result = clientEnvSchema.safeParse({ NEXT_PUBLIC_APP_ENV: "qa", NEXT_PUBLIC_APP_URL: "/" });
  expect(result.error?.issues.map((issue) => issue.path[0])).toEqual(["NEXT_PUBLIC_APP_ENV", "NEXT_PUBLIC_APP_URL"]);
});
