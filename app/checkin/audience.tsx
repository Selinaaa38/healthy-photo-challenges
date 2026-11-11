import { router } from "expo-router";
import { Button } from "../../components/Button";
import { PlaceholderScreen } from "../../components/PlaceholderScreen";

export default function AudienceScreen() {
  return (
    <PlaceholderScreen title="Who can see this?" figma="Figma 10 Audience">
      <Button
        label="Share privately"
        onPress={() => router.navigate("/checkin/complete")}
      />
      <Button label="Back" variant="text" onPress={() => router.back()} />
    </PlaceholderScreen>
  );
}
