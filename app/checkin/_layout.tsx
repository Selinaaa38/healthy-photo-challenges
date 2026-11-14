import { Stack } from "expo-router";
import { colours } from "../../constants/theme";

const headerOptions = {
  headerShown: true,
  headerBackButtonDisplayMode: "minimal",
  headerTintColor: colours.text,
  headerShadowVisible: false,
} as const;

// Camera, preview, audience, complete. Swiping back from "complete" is off,
// so a finished check-in can't be reopened.
export default function CheckinLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="preview" options={{ ...headerOptions, title: "Preview" }} />
      <Stack.Screen name="audience" options={{ ...headerOptions, title: "Who can see this?" }} />
      <Stack.Screen name="complete" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
