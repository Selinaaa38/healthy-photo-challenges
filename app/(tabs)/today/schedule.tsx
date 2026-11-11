import { router } from "expo-router";
import { Button } from "../../../components/Button";
import { PlaceholderScreen } from "../../../components/PlaceholderScreen";

export default function ScheduleSheet() {
  return (
    <PlaceholderScreen title="Schedule for later" figma="Figma 06 Schedule">
      <Button label="Close" variant="text" onPress={() => router.back()} />
    </PlaceholderScreen>
  );
}
