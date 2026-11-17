import { Stack } from "expo-router";
import { colours } from "../../../constants/theme";

const headerOptions = {
  headerShown: true,
  headerBackButtonDisplayMode: "minimal",
  headerTintColor: colours.text,
  headerShadowVisible: false,
} as const;

// Keeps the Circles list underneath a feed opened from elsewhere, so the
// feed always has a back arrow to Circles.
export const unstable_settings = { anchor: "index" };

export default function CirclesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="create" options={{ ...headerOptions, title: "New circle" }} />
      <Stack.Screen name="feed" options={headerOptions} />
    </Stack>
  );
}
