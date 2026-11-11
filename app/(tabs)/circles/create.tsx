import { router } from "expo-router";
import { Button } from "../../../components/Button";
import { PlaceholderScreen } from "../../../components/PlaceholderScreen";

export default function CreateCircleScreen() {
  return (
    <PlaceholderScreen title="New circle" figma="Figma 14 New circle">
      <Button label="Back" variant="text" onPress={() => router.back()} />
    </PlaceholderScreen>
  );
}
