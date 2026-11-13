import { Stack } from "expo-router";
import { colours } from "../../../constants/theme";

// The three "Not right now?" sheets open as modals
export default function TodayLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="detail"
        options={{
          headerShown: true,
          title: "",
          headerBackButtonDisplayMode: "minimal",
          headerTintColor: colours.text,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen name="easier" options={{ presentation: "modal" }} />
      <Stack.Screen name="schedule" options={{ presentation: "modal" }} />
      <Stack.Screen name="skip" options={{ presentation: "modal" }} />
    </Stack>
  );
}
