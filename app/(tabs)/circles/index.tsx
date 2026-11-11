import { router } from "expo-router";
import { Button } from "../../../components/Button";
import { PlaceholderScreen } from "../../../components/PlaceholderScreen";

export default function CirclesScreen() {
  return (
    <PlaceholderScreen title="Circles" figma="Figma 13 Circles">
      <Button
        label="New circle"
        onPress={() => router.navigate("/circles/create")}
      />
      <Button
        label="Open Family feed"
        variant="secondary"
        onPress={() => router.navigate("/circles/feed")}
      />
    </PlaceholderScreen>
  );
}
