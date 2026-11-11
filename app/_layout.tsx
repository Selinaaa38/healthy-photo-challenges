import { Stack } from "expo-router";

// Root layout: onboarding, the five (tabs), and the check-in flow.
// Check-in slides up over the tabs, so the tab bar is hidden during it.
export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="checkin"
        options={{ presentation: "fullScreenModal" }}
      />
    </Stack>
  );
}
