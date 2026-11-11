import { Stack } from "expo-router";

// The three "Not right now?" sheets open as modals, like the Week 7 and 8
// create and add screens.
export default function TodayLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="easier" options={{ presentation: "modal" }} />
      <Stack.Screen name="schedule" options={{ presentation: "modal" }} />
      <Stack.Screen name="skip" options={{ presentation: "modal" }} />
    </Stack>
  );
}
