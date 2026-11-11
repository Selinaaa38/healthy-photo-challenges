import { router } from "expo-router";
import { Button } from "../../../components/Button";
import { PlaceholderScreen } from "../../../components/PlaceholderScreen";

export default function EditPreferencesScreen() {
  return (
    <PlaceholderScreen title="Edit preferences" figma="Figma 02 Preferences">
      <Button label="Back" variant="text" onPress={() => router.back()} />
    </PlaceholderScreen>
  );
}
