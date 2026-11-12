import { router } from "expo-router";
import { PreferencesForm } from "../../components/PreferencesForm";
import DataService from "../../services/DataService";
import { Preferences } from "../../types";

// Figma 02: first-time preferences, reached from Welcome.
export default function OnboardingPreferencesScreen() {
  const save = async (prefs: Preferences) => {
    await DataService.savePreferences(prefs);
    router.replace("/today");
  };

  // Same as "Explore first": the 3 general challenges (US01).
  const skip = async () => {
    await DataService.start();
    router.replace("/today");
  };

  return (
    <PreferencesForm
      initial={null}
      saveLabel="Save and see my challenges"
      onSave={save}
      onSkip={skip}
    />
  );
}
