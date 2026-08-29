//oof-app/lib/matcher.ts
import { db } from "./db/client";
import { items, stores } from "./db/schema";
import { eq, and, gt } from "drizzle-orm";
import { downloadAndParseFlyer } from "./pdf";
import { draftEmail } from "./email";

export async function runPriceMatch() {
  // Get all active stores
  const activeStores = await db.select().from(stores).where(eq(stores.isActive, 1));
  
  // Get items from last 7 days that haven't been matched
  const recentItems = await db.select().from(items).where(eq(items.emailSent, 0));
  
  for (const store of activeStores) {
    const flyerText = await downloadAndParseFlyer(store.flyerUrl);
    
    for (const item of recentItems) {
      // Check if item appears in flyer
      const foundLine = flyerText.find(line => 
        line.toLowerCase().includes(item.name.toLowerCase())
      );
      
      if (foundLine) {
        const priceMatch = foundLine.match(/\$?(\d+\.\d{2})/);
        if (priceMatch) {
          const flyerPrice = parseFloat(priceMatch[1]);
          
          if (flyerPrice < item.price) {
            // Found a match!
            await db.update(items).set({
              matchedPrice: flyerPrice,
              matchedStore: store.name,
            }).where(eq(items.id, item.id));
            
            // Draft email
            await draftEmail(item, store, flyerPrice);
          }
        }
      }
    }
  }
}