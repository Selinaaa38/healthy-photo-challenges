import { Stack } from "expo-router";
import { colours } from "../../constants/theme";

// Header styling
const headerOptions = {
  headerShown: true,
  headerBackButtonDisplayMode: "minimal",
  headerTintColor: colours.text,
  headerShadowVisible: false,
} as const;

export default function CheckinLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="preview" options={{ ...headerOptions, title: "Preview" }} />
      <Stack.Screen name="audience" options={{ ...headerOptions, title: "Who can see this?" }} />
      {/* Prevent back-swipe after check-in. */}
      <Stack.Screen name="complete" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
