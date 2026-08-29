//oof-app/app/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import { runMigrations } from "@/lib/db/migrate";

export default function RootLayout() {
  useEffect(() => {
    runMigrations();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="receipt/[id]" 
          options={{ 
            title: "Receipt Details",
            presentation: "card",
          }} 
        />
        <Stack.Screen 
          name="receipt/new" 
          options={{ 
            title: "New Receipt",
            presentation: "modal",
          }} 
        />
      </Stack>
    </SafeAreaProvider>
  );
}