import { router } from "expo-router";
import { Button } from "../../components/Button";
import { PlaceholderScreen } from "../../components/PlaceholderScreen";

export default function CameraScreen() {
  return (
    <PlaceholderScreen title="Camera" figma="Figma 08 Camera">
      <Button
        label="Take photo"
        onPress={() => router.navigate("/checkin/preview")}
      />
      <Button label="Close" variant="text" onPress={() => router.back()} />
    </PlaceholderScreen>
  );
}
