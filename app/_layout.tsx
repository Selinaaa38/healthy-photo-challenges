import { Stack } from "expo-router";

// Root layout: onboarding, the five (tabs), the check-in flow and stories.
// Check-in and stories slide up over the tabs, so the tab bar is hidden.
export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="checkin"
        options={{ presentation: "fullScreenModal" }}
      />
      <Stack.Screen name="story" options={{ presentation: "fullScreenModal" }} />
    </Stack>
  );
}
