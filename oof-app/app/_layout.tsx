//oof-app/app/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
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