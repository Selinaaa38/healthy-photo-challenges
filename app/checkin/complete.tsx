import { router } from "expo-router";
import { Button } from "../../components/Button";
import { PlaceholderScreen } from "../../components/PlaceholderScreen";

export default function CompleteScreen() {
  // dismissTo closes the check-in flow and goes back to the Today tab
  // (the same call the Week 7 lecture uses after creating a note).
  return (
    <PlaceholderScreen title="Challenge complete" figma="Figma 11 Complete">
      <Button label="Back to home" onPress={() => router.dismissTo("/today")} />
    </PlaceholderScreen>
  );
}
