import { router } from "expo-router";
import { Button } from "../../../components/Button";
import { PlaceholderScreen } from "../../../components/PlaceholderScreen";

export default function EasierSheet() {
  return (
    <PlaceholderScreen title="Try something else?" figma="Figma 05 Something easier">
      <Button label="Close" variant="text" onPress={() => router.back()} />
    </PlaceholderScreen>
  );
}
