//oof-app/lib/ocr.ts
import * as ImageManipulator from "expo-image-manipulator";

// Simple OCR - for MVP, just return text from image
// In production, use Google Cloud Vision or similar
export async function extractTextFromImage(uri: string) {
  // For now, return empty string
  // We'll implement real OCR later
  console.log("OCR called with URI:", uri);
  return "Sample receipt text\nMilk $4.99\nBread $3.49";
}

export function parseReceiptText(text: string) {
  const lines = text.split('\n').filter(line => line.trim());
  const items = [];
  
  for (const line of lines) {
    const priceMatch = line.match(/\$?(\d+\.\d{2})/);
    if (priceMatch) {
      const name = line.replace(/\$?(\d+\.\d{2})/, '').trim();
      items.push({
        name: name || "Unknown Item",
        price: parseFloat(priceMatch[1])
      });
    }
  }
  
  return items;
}