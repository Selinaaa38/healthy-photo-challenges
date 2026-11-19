import { Stack } from "expo-router";
import { colours } from "../../constants/theme";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="preferences"
        options={{
          // Show back arrow and title during preference setup
          headerShown: true,
          title: "Your preferences",
          headerBackButtonDisplayMode: "minimal",
          headerTintColor: colours.text,
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
