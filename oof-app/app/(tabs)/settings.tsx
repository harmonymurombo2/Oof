//oof-app/app/(tabs)/settings.tsx
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from "react-native";
import { useState, useEffect } from "react";
import { db } from "@/lib/db/client";
import { stores } from "@/lib/db/schema";
import { InferSelectModel } from "drizzle-orm";

type Store = InferSelectModel<typeof stores>;

export default function SettingsScreen() {
  const [storeList, setStoreList] = useState<Store[]>([]);
  const [newStore, setNewStore] = useState({
    name: "",
    flyerUrl: "",
    customerEmail: "",
  });

  useEffect(() => {
    loadStores();
  }, []);

  async function loadStores() {
    try {
      const result = await db.select().from(stores);
      setStoreList(result);
    } catch (error) {
      console.error("Failed to load stores:", error);
    }
  }

  async function addStore() {
    if (!newStore.name || !newStore.flyerUrl || !newStore.customerEmail) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const id = Date.now().toString();
      await db.insert(stores).values({
        id,
        name: newStore.name,
        flyerUrl: newStore.flyerUrl,
        customerEmail: newStore.customerEmail,
        isActive: 1,
      });
      setNewStore({ name: "", flyerUrl: "", customerEmail: "" });
      loadStores();
      Alert.alert("Success", "Store added!");
    } catch (error) {
      console.error("Failed to add store:", error);
      Alert.alert("Error", "Failed to add store");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Settings</Text>
      
      <View style={styles.form}>
        <Text style={styles.formTitle}>Add Store</Text>
        <TextInput
          style={styles.input}
          placeholder="Store Name (e.g., Walmart)"
          value={newStore.name}
          onChangeText={(text) => setNewStore({ ...newStore, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Flyer PDF URL"
          value={newStore.flyerUrl}
          onChangeText={(text) => setNewStore({ ...newStore, flyerUrl: text })}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Customer Service Email"
          value={newStore.customerEmail}
          onChangeText={(text) => setNewStore({ ...newStore, customerEmail: text })}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TouchableOpacity style={styles.addButton} onPress={addStore}>
          <Text style={styles.addButtonText}>Add Store</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>Your Stores</Text>
      <FlatList
        data={storeList}
        renderItem={({ item }) => (
          <View style={styles.storeCard}>
            <Text style={styles.storeName}>{item.name}</Text>
            <Text style={styles.storeUrl}>{item.flyerUrl}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No stores added yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: "bold", marginTop: 20, marginBottom: 10 },
  form: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  formTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "#6C63FF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  storeCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  storeName: { fontWeight: "bold", fontSize: 16 },
  storeUrl: { color: "#666", fontSize: 12, marginTop: 4 },
  emptyText: { textAlign: "center", marginTop: 20, color: "#999" },
});