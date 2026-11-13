import { Stack } from "expo-router";
import { colours } from "../../../constants/theme";

// The "Something easier" and "Skip" sheets slide up from the bottom
const sheetOptions = {
  presentation: "formSheet",
  sheetAllowedDetents: "fitToContents",
  sheetGrabberVisible: true,
} as const;

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
      <Stack.Screen name="easier" options={sheetOptions} />
      {/* Full-height so the date and time wheels have room (B4) */}
      <Stack.Screen name="schedule" options={{ presentation: "modal" }} />
      <Stack.Screen name="skip" options={sheetOptions} />
    </Stack>
  );
}
