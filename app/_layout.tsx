import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Open check-in and stories */}
      <Stack.Screen
        name="checkin"
        options={{ presentation: "fullScreenModal" }}
      />
      <Stack.Screen name="story" options={{ presentation: "fullScreenModal" }} />
    </Stack>
  );
}
