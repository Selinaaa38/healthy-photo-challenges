import { router } from "expo-router";
import { Button } from "../../components/Button";
import { PlaceholderScreen } from "../../components/PlaceholderScreen";

export default function OnboardingPreferencesScreen() {
  return (
    <PlaceholderScreen title="Your preferences" figma="Figma 02 Preferences">
      <Button
        label="Save and see my challenges"
        onPress={() => router.replace("/today")}
      />
      <Button
        label="Skip for now"
        variant="text"
        onPress={() => router.replace("/today")}
      />
    </PlaceholderScreen>
  );
}
