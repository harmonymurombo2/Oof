//oof-app/lib/db/schema.ts
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const receipts = sqliteTable("receipts", {
  id: text("id").primaryKey(),
  storeName: text("store_name").notNull(),
  purchaseDate: text("purchase_date").notNull(),
  photoUri: text("photo_uri").notNull(),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"), // Add .notNull()
});

export const items = sqliteTable("items", {
  id: text("id").primaryKey(),
  receiptId: text("receipt_id").notNull().references(() => receipts.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  price: real("price").notNull(),
  matchedPrice: real("matched_price"),
  matchedStore: text("matched_store"),
  emailSent: integer("email_sent").default(0),
});

export const stores = sqliteTable("stores", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  flyerUrl: text("flyer_url").notNull(),
  customerEmail: text("customer_email").notNull(),
  isActive: integer("is_active").default(1),
});