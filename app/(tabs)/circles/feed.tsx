import { router } from "expo-router";
import { Button } from "../../../components/Button";
import { PlaceholderScreen } from "../../../components/PlaceholderScreen";

export default function CircleFeedScreen() {
  return (
    <PlaceholderScreen title="Family" figma="Figma 15 Circle feed">
      <Button label="Back" variant="text" onPress={() => router.back()} />
    </PlaceholderScreen>
  );
}
