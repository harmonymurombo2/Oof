//oof-app/drizzle.turso.config.ts
import type { Config } from "drizzle-kit";

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle/turso-migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.EXPO_PUBLIC_TURSO_URL!,
    authToken: process.env.EXPO_PUBLIC_TURSO_AUTH_TOKEN!,
  },
} satisfies Config;