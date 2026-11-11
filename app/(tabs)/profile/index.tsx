import { router } from "expo-router";
import { Button } from "../../../components/Button";
import { PlaceholderScreen } from "../../../components/PlaceholderScreen";

export default function ProfileScreen() {
  return (
    <PlaceholderScreen title="Profile" figma="Figma 16 Profile">
      <Button
        label="Edit preferences"
        variant="secondary"
        onPress={() => router.navigate("/profile/preferences")}
      />
    </PlaceholderScreen>
  );
}
