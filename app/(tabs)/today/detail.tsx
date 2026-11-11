import { router } from "expo-router";
import { Button } from "../../../components/Button";
import { PlaceholderScreen } from "../../../components/PlaceholderScreen";

export default function ChallengeDetailScreen() {
  return (
    <PlaceholderScreen title="Challenge details" figma="Figma 04 Details">
      <Button label="Start challenge" onPress={() => router.push("/checkin")} />
      <Button
        label="Something easier"
        variant="secondary"
        onPress={() => router.navigate("/today/easier")}
      />
      <Button
        label="Schedule for later"
        variant="secondary"
        onPress={() => router.navigate("/today/schedule")}
      />
      <Button
        label="Skip today"
        variant="secondary"
        onPress={() => router.navigate("/today/skip")}
      />
      <Button label="Back" variant="text" onPress={() => router.back()} />
    </PlaceholderScreen>
  );
}
