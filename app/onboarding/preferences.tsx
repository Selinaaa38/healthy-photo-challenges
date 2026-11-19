import { router } from "expo-router";
import { PreferencesForm } from "../../components/PreferencesForm";
import DataService from "../../services/DataService";
import { Preferences } from "../../types";

export default function OnboardingPreferencesScreen() {
  // Save preferences and navigate to Today challenges screen
  const save = async (prefs: Preferences) => {
    await DataService.savePreferences(prefs);
    router.replace("/today");
  };

  // Same as screen as "Explore first" for 3 general challenges (US01).
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
