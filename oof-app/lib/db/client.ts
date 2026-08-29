//oof-app/lib/db/client.ts
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

// Local SQLite
import { openDatabaseSync } from "expo-sqlite";
import { drizzle as drizzleExpo } from "drizzle-orm/expo-sqlite";

const expoDb = openDatabaseSync("oof.db");
export const db = drizzleExpo(expoDb, { schema });

// Turso Cloud
const tursoClient = createClient({
  url: process.env.EXPO_PUBLIC_TURSO_URL!,
  authToken: process.env.EXPO_PUBLIC_TURSO_AUTH_TOKEN!,
});

export const cloudDb = drizzle(tursoClient, { schema });

export async function syncToCloud() {
  try {
    console.log("Syncing to Turso cloud...");
    
    const localReceipts = await db.select().from(schema.receipts);
    
    for (const receipt of localReceipts) {
      await cloudDb.insert(schema.receipts).values(receipt);
    }
    
    console.log(`Synced ${localReceipts.length} receipts to cloud`);
    return true;
  } catch (error) {
    console.error("Sync failed:", error);
    return false;
  }
}