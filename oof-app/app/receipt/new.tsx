//oof-app/app/receipt/new.tsx
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import { db } from "@/lib/db/client";
import { receipts, items } from "@/lib/db/schema";
import { extractTextFromImage, parseReceiptText } from "@/lib/ocr";

export default function NewReceiptScreen() {
  const { photoUri } = useLocalSearchParams();
  const [storeName, setStoreName] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  async function saveReceipt() {
    if (!storeName) {
      Alert.alert("Error", "Please enter a store name");
      return;
    }

    setLoading(true);
    try {
      // Generate a unique ID
      const receiptId = Date.now().toString();
      
      // Insert receipt
      await db.insert(receipts).values({
        id: receiptId,
        storeName: storeName,
        purchaseDate: purchaseDate,
        photoUri: photoUri as string,
      });

      // OCR the receipt
      const ocrText = await extractTextFromImage(photoUri as string);
      const parsedItems = parseReceiptText(ocrText);
      
      // Insert items
      for (const item of parsedItems) {
        await db.insert(items).values({
          id: Date.now().toString() + Math.random().toString(36).substring(7),
          receiptId: receiptId,
          name: item.name,
          price: item.price,
        });
      }

      Alert.alert("Success", "Receipt saved!");
      router.back();
    } catch (error) {
      console.error("Failed to save receipt:", error);
      Alert.alert("Error", "Failed to save receipt");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Receipt</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Store Name (e.g., Walmart)"
        value={storeName}
        onChangeText={setStoreName}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Purchase Date"
        value={purchaseDate}
        onChangeText={setPurchaseDate}
      />
      
      <TouchableOpacity 
        style={styles.saveButton} 
        onPress={saveReceipt}
        disabled={loading}
      >
        <Text style={styles.saveButtonText}>
          {loading ? "Saving..." : "💾 Save Receipt"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  saveButton: {
    backgroundColor: "#6C63FF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});