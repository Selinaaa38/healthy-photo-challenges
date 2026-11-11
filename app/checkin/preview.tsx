import { router } from "expo-router";
import { Button } from "../../components/Button";
import { PlaceholderScreen } from "../../components/PlaceholderScreen";

export default function PreviewScreen() {
  return (
    <PlaceholderScreen title="Preview" figma="Figma 09 Preview">
      <Button
        label="Next: choose who can see it"
        onPress={() => router.navigate("/checkin/audience")}
      />
      <Button label="Back" variant="text" onPress={() => router.back()} />
    </PlaceholderScreen>
  );
}
