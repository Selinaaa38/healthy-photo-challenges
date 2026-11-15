import { Stack } from "expo-router";
import { colours } from "../../../constants/theme";

export default function CirclesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="create"
        options={{
          headerShown: true,
          title: "New circle",
          headerBackButtonDisplayMode: "minimal",
          headerTintColor: colours.text,
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
