//oof-app/lib/db/migrate.ts
import { db } from "./client";

export async function runMigrations() {
  try {
    // Check if receipts table exists
    const result = await db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='receipts'");
    
    if (!result) {
      console.log("Creating tables...");
      
      await db.run(`
        CREATE TABLE receipts (
          id TEXT PRIMARY KEY,
          store_name TEXT NOT NULL,
          purchase_date TEXT NOT NULL,
          photo_uri TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      await db.run(`
        CREATE TABLE items (
          id TEXT PRIMARY KEY,
          receipt_id TEXT NOT NULL,
          name TEXT NOT NULL,
          price REAL NOT NULL,
          matched_price REAL,
          matched_store TEXT,
          email_sent INTEGER DEFAULT 0,
          FOREIGN KEY (receipt_id) REFERENCES receipts(id) ON DELETE CASCADE
        )
      `);
      
      await db.run(`
        CREATE TABLE stores (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          flyer_url TEXT NOT NULL,
          customer_email TEXT NOT NULL,
          is_active INTEGER DEFAULT 1
        )
      `);
      
      console.log("✅ Tables created");
    } else {
      console.log("✅ Tables already exist");
    }
  } catch (error) {
    console.error("❌ Migration failed:", error);
  }
}