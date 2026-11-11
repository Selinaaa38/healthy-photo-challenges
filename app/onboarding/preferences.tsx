import { router } from "expo-router";
import { Button } from "../../components/Button";
import { PlaceholderScreen } from "../../components/PlaceholderScreen";
import DataService from "../../services/DataService";

export default function OnboardingPreferencesScreen() {
  // Placeholder
  const finish = async () => {
    await DataService.start();
    router.replace("/today");
  };

  return (
    <PlaceholderScreen title="Your preferences" figma="Figma 02 Preferences">
      <Button
        label="Save and see my challenges"
        onPress={finish}
      />
      <Button
        label="Skip for now"
        variant="text"
        onPress={finish}
      />
    </PlaceholderScreen>
  );
}
