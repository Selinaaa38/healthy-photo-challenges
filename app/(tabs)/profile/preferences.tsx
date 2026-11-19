import { router } from "expo-router";
import { useEffect, useState } from "react";
import { PreferencesForm } from "../../../components/PreferencesForm";
import DataService from "../../../services/DataService";
import { Preferences } from "../../../types";

// Edit preferences from Profile, using the same form as onboarding (US02).
export default function EditPreferencesScreen() {
  const [prefs, setPrefs] = useState<Preferences | null>();

  // Load user's saved preferences
  useEffect(() => {
    DataService.getData().then((data) => setPrefs(data.preferences));
  }, []);

  // Save changes and return to Profile
  const save = async (newPrefs: Preferences) => {
    await DataService.savePreferences(newPrefs);
    router.back();
  };

  if (prefs === undefined) return null;
  return <PreferencesForm initial={prefs} saveLabel="Save changes" onSave={save} />;
}
