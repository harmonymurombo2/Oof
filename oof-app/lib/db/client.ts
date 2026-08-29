//oof-app/lib/db/client.ts
// For local
import { drizzle as drizzleExpo } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema";

const expoDb = openDatabaseSync("oof.db");
export const db = drizzleExpo(expoDb, { schema });

// For cloud - using fetch directly
export async function queryCloud(sql: string, params: any[] = []) {
  const response = await fetch(process.env.EXPO_PUBLIC_TURSO_URL!, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.EXPO_PUBLIC_TURSO_AUTH_TOKEN!}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, args: params }),
  });
  return response.json();
}