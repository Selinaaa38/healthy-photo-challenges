import { router } from "expo-router";
import { Button } from "../../../components/Button";
import { PlaceholderScreen } from "../../../components/PlaceholderScreen";

export default function SkipSheet() {
  return (
    <PlaceholderScreen title="Skip this challenge?" figma="Figma 07 Skip today">
      <Button label="Close" variant="text" onPress={() => router.back()} />
    </PlaceholderScreen>
  );
}
