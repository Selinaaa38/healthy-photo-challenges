import { router } from "expo-router";
import { Button } from "../../../components/Button";
import { PlaceholderScreen } from "../../../components/PlaceholderScreen";

export default function TodayScreen() {
  return (
    <PlaceholderScreen title="Today" figma="Figma 03 Today">
      <Button
        label="Open a challenge"
        onPress={() => router.navigate("/today/detail")}
      />
    </PlaceholderScreen>
  );
}
