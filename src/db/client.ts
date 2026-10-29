import "server-only";
import { drizzle } from "drizzle-orm/node-postgres";

import { appConfig } from "@/config/app-config";
import { serverEnv } from "@/config/server.env";
import * as schema from "@/db/schema";

function createClient() {
  return drizzle(serverEnv.DATABASE_URL, { schema, casing: "snake_case" });
}

const globalForDb = globalThis as { db?: ReturnType<typeof createClient> };

export const db = globalForDb.db ?? createClient();

if (!appConfig.isProduction) globalForDb.db = db;
