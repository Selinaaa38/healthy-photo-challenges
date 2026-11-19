import { Stack } from "expo-router";
import { colours } from "../../../constants/theme";

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="preferences"
        options={{
          headerShown: true,
          title: "Edit preferences",
          headerBackButtonDisplayMode: "minimal",
          headerTintColor: colours.text,
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
