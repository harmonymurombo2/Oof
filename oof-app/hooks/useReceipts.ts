//oof-app/hooks/useReceipts.ts
import { useState, useEffect } from "react";
import { db } from "@/lib/db/client";
import { receipts } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { InferSelectModel } from "drizzle-orm";

type Receipt = InferSelectModel<typeof receipts>;

export function useReceipts() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadReceipts();
  }, []);
  
  async function loadReceipts() {
    try {
      setLoading(true);
      const result = await db
        .select()
        .from(receipts)
        .orderBy(desc(receipts.createdAt));
      setReceipts(result);
    } catch (error) {
      console.error("Failed to load receipts:", error);
    } finally {
      setLoading(false);
    }
  }
  
  return { receipts, loading, refresh: loadReceipts };
}