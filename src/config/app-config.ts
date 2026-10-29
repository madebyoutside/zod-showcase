import { clientEnv } from "@/config/client.env";

export const appConfig = {
  name: "Zod Showcase",
  env: clientEnv.NEXT_PUBLIC_APP_ENV,
  url: clientEnv.NEXT_PUBLIC_APP_URL,
  isProduction: clientEnv.NEXT_PUBLIC_APP_ENV === "production",
} as const;
