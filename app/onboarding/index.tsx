import { router } from "expo-router";
import { Button } from "../../components/Button";
import { PlaceholderScreen } from "../../components/PlaceholderScreen";

export default function WelcomeScreen() {
  return (
    <PlaceholderScreen title="Welcome" figma="Figma 01 Welcome">
      <Button
        label="Set my preferences"
        onPress={() => router.navigate("/onboarding/preferences")}
      />
      <Button
        label="Explore first"
        variant="secondary"
        onPress={() => router.replace("/today")}
      />
    </PlaceholderScreen>
  );
}
