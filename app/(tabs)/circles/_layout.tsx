import { Stack } from "expo-router";
import { colours } from "../../../constants/theme";

const headerOptions = {
  headerShown: true,
  headerBackButtonDisplayMode: "minimal",
  headerTintColor: colours.text,
  headerShadowVisible: false,
} as const;

export default function CirclesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="create" options={{ ...headerOptions, title: "New circle" }} />
      <Stack.Screen name="feed" options={headerOptions} />
    </Stack>
  );
}
