import { router } from "expo-router";
import { Alert } from "react-native";
import { Button } from "../../../components/Button";
import { PlaceholderScreen } from "../../../components/PlaceholderScreen";
import DataService from "../../../services/DataService";

export default function ProfileScreen() {
  const confirmReset = () => {
    Alert.alert("Reset demo data?", "This deletes your check-ins and settings.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: async () => {
          await DataService.clear();
          router.replace("/onboarding");
        },
      },
    ]);
  };

  return (
    <PlaceholderScreen title="Profile" figma="Figma 16 Profile">
      <Button
        label="Edit preferences"
        variant="secondary"
        onPress={() => router.navigate("/profile/preferences")}
      />
      <Button label="Reset demo data" variant="destructive" onPress={confirmReset} />
    </PlaceholderScreen>
  );
}
