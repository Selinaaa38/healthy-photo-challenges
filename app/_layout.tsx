import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

// Root layout: every screen in the app sits inside this Stack.
// Later subtasks add the onboarding flow, the five tabs and the check-in flow here.
export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
