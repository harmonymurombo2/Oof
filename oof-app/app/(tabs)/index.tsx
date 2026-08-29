//oof-app/app/(tabs)/index.tsx
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useReceipts } from "@/hooks/useReceipts";
import { router } from "expo-router";

export default function HomeScreen() {
  const { receipts } = useReceipts();
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={() => router.push("/scan")}
        style={styles.scanButton}
      >
        <Text style={styles.scanButtonText}>
          📸 Scan Receipt
        </Text>
      </TouchableOpacity>
      
      <FlatList
        data={receipts}
        renderItem={({ item }) => (
          <View style={styles.receiptCard}>
            <Text style={styles.storeName}>{item.storeName}</Text>
            <Text style={styles.date}>
              {new Date(item.purchaseDate).toLocaleDateString()}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No receipts yet. Scan one!
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  scanButton: { 
    backgroundColor: "#6C63FF", 
    padding: 15, 
    borderRadius: 10,
    marginBottom: 20 
  },
  scanButtonText: { 
    color: "white", 
    textAlign: "center", 
    fontSize: 18,
    fontWeight: "bold" 
  },
  receiptCard: { 
    padding: 15, 
    backgroundColor: "white", 
    marginBottom: 10, 
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  storeName: { fontWeight: "bold", fontSize: 16 },
  date: { color: "#666", marginTop: 4 },
  emptyText: { 
    textAlign: "center", 
    marginTop: 50, 
    color: "#999",
    fontSize: 16 
  },
});