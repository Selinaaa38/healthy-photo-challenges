import { Stack } from "expo-router";

// Camera, preview, audience, complete. Swiping back from "complete" is off,
// so a finished check-in can't be reopened.
export default function CheckinLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="complete" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
