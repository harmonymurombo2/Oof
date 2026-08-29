//oof-app/app/(tabs)/matches.tsx
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useState } from "react";

export default function MatchesScreen() {
  const [matches, setMatches] = useState([]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏷️ Price Matches</Text>
      <FlatList
        data={matches}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.itemName}>Item Name</Text>
            <Text>Original: $10.00 → Matched: $7.99</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No matches found yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  itemName: { fontWeight: "bold", fontSize: 16 },
  emptyText: { textAlign: "center", marginTop: 50, color: "#999" },
});